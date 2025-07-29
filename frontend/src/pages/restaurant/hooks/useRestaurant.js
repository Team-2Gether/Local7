import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { fetchAllRestaurants } from '../../../api/RestaurantApi';

// 1. 음식점 데이터 로딩 및 검색, 정렬
export const useRestaurants = () => {
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSortBy, setActiveSortBy] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAllRestaurants();
            setAllRestaurants(data);
            setFilteredRestaurants(data); // 초기에는 모든 음식점을 필터링된 목록으로 설정
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSearch = useCallback(() => {
        if (searchTerm.trim() === '') {
            setFilteredRestaurants(allRestaurants);
        } else {
            const results = allRestaurants.filter(
                r => r.restaurantName.includes(searchTerm.trim())
            );
            setFilteredRestaurants(results);
        }
    }, [searchTerm, allRestaurants]);

    // handleShowAllRestaurants는 Restaurant.js에서 더 이상 사용되지 않으므로 제거하거나 주석 처리할 수 있습니다.
    // 현재 Restaurant.js에서는 setSearchTerm('') 후 handleSearch()를 호출하고 있습니다.
    /*
    const handleShowAllRestaurants = useCallback(() => {
        setSearchTerm('');
        setFilteredRestaurants(allRestaurants);
    }, [allRestaurants]);
    */

    const handleSortClick = useCallback((sortBy) => {
        setActiveSortBy(sortBy);
        let sorted = [...filteredRestaurants]; // 현재 필터링된 목록을 복사하여 정렬
        if (sortBy === 'rating') {
            sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        } else if (sortBy === 'comments') {
            sorted.sort((a, b) => (b.totalComments || 0) - (a.totalComments || 0));
        }
        setFilteredRestaurants(sorted);
    }, [filteredRestaurants]);

    // refetchRestaurants는 loadData를 다시 호출하여 모든 데이터를 새로 불러옵니다.
    const refetchRestaurants = useCallback(() => {
        loadData();
    }, [loadData]);


    return {
        allRestaurants,
        filteredRestaurants,
        setFilteredRestaurants,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        handleSearch,
        // handleShowAllRestaurants, // Restaurant.js에서 사용되지 않으므로 제거 또는 주석 처리
        activeSortBy,
        handleSortClick,
        refetchRestaurants,
    };
};

// 2. 지도 기능
// isKakaoMapLoaded 인자 추가
export const useMap = (
    allRestaurants,
    setFilteredRestaurants,
    handleRestaurantClick,
    isKakaoMapLoaded // Restaurant.js에서 전달받은 카카오맵 로딩 상태
) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const myLocationMarkerRef = useRef(null); // 내 위치 마커
    const clickMarkerRef = useRef(null); // 클릭한 위치 마커
    const markersRef = useRef([]); // 음식점 마커들을 관리할 배열
    const infoWindowRef = useRef(null); // 인포윈도우 인스턴스

    const DONGHAE_CITY_HALL_LAT = 37.5255;
    const DONGHAE_CITY_HALL_LON = 129.1147;
    // KAKAO_APP_KEY는 public/index.html에서 로드되므로 여기서는 필요 없습니다.
    // const KAKAO_APP_KEY = '690813b8710fce175e3acf9121422624'; 

    // 마커 업데이트 함수
    const updateMapMarkers = useCallback((mapInstance, restaurants) => {
        // 기존 마커 제거
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // 기존 인포윈도우 닫기
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
            infoWindowRef.current = null;
        }

        if (!mapInstance) return;

        const bounds = new window.kakao.maps.LatLngBounds();
        
        restaurants.forEach((r) => {
            // 위도, 경도 값이 유효한지 확인
            if (r.restaurantLat && r.restaurantLon) {
                const pos = new window.kakao.maps.LatLng(+r.restaurantLat, +r.restaurantLon);
                const marker = new window.kakao.maps.Marker({
                    map: mapInstance,
                    position: pos,
                    title: r.restaurantName,
                });

                // 마커 클릭 시 인포윈도우 표시 및 모달 열기
                window.kakao.maps.event.addListener(marker, 'click', function() {
                    // 기존 인포윈도우 닫기
                    if (infoWindowRef.current) {
                        infoWindowRef.current.close();
                    }
                    const content = `<div style="padding:5px;font-size:12px;">${r.restaurantName}<br/>평점: ${r.averageRating ? r.averageRating.toFixed(1) : '없음'}<br/>리뷰: ${r.totalComments !== undefined ? r.totalComments : 0}개</div>`;
                    infoWindowRef.current = new window.kakao.maps.InfoWindow({
                        content: content,
                        removable: true
                    });
                    infoWindowRef.current.open(mapInstance, marker);

                    // 음식점 상세 모달 열기
                    handleRestaurantClick(r);
                });

                markersRef.current.push(marker);
                bounds.extend(pos);
            } else {
                console.warn(`음식점 ID ${r.restaurantId} (${r.restaurantName})의 위도 또는 경도 정보가 유효하지 않습니다.`);
            }
        });

        if (restaurants.length > 0) {
            mapInstance.setBounds(bounds);
        }
    }, [handleRestaurantClick]); // handleRestaurantClick 의존성 추가

    // 지도의 idle 상태일 때 보이는 음식점 필터링
    const filterVisibleRestaurants = useCallback(() => {
        const map = mapRef.current;
        if (!map || allRestaurants.length === 0) return;
        
        const bounds = map.getBounds();
        const visibleRestaurants = allRestaurants.filter(r => {
            if (r.restaurantLat && r.restaurantLon) {
                const pos = new window.kakao.maps.LatLng(+r.restaurantLat, +r.restaurantLon);
                return bounds.contain(pos);
            }
            return false;
        });
        setFilteredRestaurants(visibleRestaurants);
    }, [allRestaurants, setFilteredRestaurants]);

    // 지도 생성 및 초기화 (isKakaoMapLoaded 조건 추가)
    useEffect(() => {
        const container = mapContainerRef.current;
        // isKakaoMapLoaded가 true이고, container가 존재하며, mapRef.current가 아직 초기화되지 않았을 때만 지도 생성
        if (isKakaoMapLoaded && container && !mapRef.current) {
            const map = new window.kakao.maps.Map(container, {
                center: new window.kakao.maps.LatLng(DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON),
                level: 3
            });

            mapRef.current = map;

            // 지도가 이동 또는 확대/축소 완료 시 현재 보이는 영역의 음식점만 필터링
            window.kakao.maps.event.addListener(map, 'idle', filterVisibleRestaurants);
            
            // 초기 마커 표시
            updateMapMarkers(map, allRestaurants);
        }
    }, [isKakaoMapLoaded, allRestaurants, filterVisibleRestaurants, updateMapMarkers]); // allRestaurants 의존성 추가

    // 클릭 시 마커 및 반경 필터링
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        
        // 기존 클릭 리스너 제거 (중복 방지)
        // 이 부분은 addListener가 반환하는 함수를 저장해서 cleanup 하는 방식으로 변경하는 것이 더 안전합니다.
        // 현재는 useEffect가 다시 실행될 때마다 리스너가 추가될 수 있습니다.
        // 하지만, mapRef.current가 !mapRef.current 조건으로 한 번만 생성되므로 큰 문제는 아닐 수 있습니다.

        window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
            const latlng = mouseEvent.latLng;
            const imageSrc = '/local7Compass1.png'; // 사용할 이미지 경로 (public 폴더 기준)
            const imageSize = new window.kakao.maps.Size(40, 40); // 마커 이미지의 크기
            const imageOption = {
                offset: new window.kakao.maps.Point(20, 40)
            };

            const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            // 클릭 마커 중복 제거
            if (clickMarkerRef.current) {
                clickMarkerRef.current.setMap(null);
            }
            // 내 위치 마커 제거
            if (myLocationMarkerRef.current) {
                myLocationMarkerRef.current.setMap(null);
            }

            const marker = new window.kakao.maps.Marker({map: map, position: latlng, image: markerImage});
            clickMarkerRef.current = marker;

            // 마커 클릭 이벤트 (클릭 마커 클릭 시 모달 열기)
            window.kakao.maps.event.addListener(marker, 'click', function () {
                handleRestaurantClick(
                    {restaurantName: '선택 위치', restaurantLat: latlng.getLat(), restaurantLon: latlng.getLng(), addrDetail: '사용자 지정 위치입니다.'}
                );
            });

            const getDistance = (lat1, lon1, lat2, lon2) => {
                const R = 6371;
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(
                    lat2 * Math.PI / 180
                ) * Math.sin(dLon / 2) ** 2;
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c;
            };

            const centerLat = latlng.getLat();
            const centerLon = latlng.getLng();

            const filtered = allRestaurants.filter(r => {
                if (r.restaurantLat && r.restaurantLon) {
                    const distance = getDistance(
                        centerLat,
                        centerLon,
                        r.restaurantLat,
                        r.restaurantLon
                    );
                    return distance <= 10; // 10km 반경 필터링 (기존 로직 유지)
                }
                return false;
            });

            setFilteredRestaurants(filtered);
        });
    }, [allRestaurants, setFilteredRestaurants, handleRestaurantClick]);

    // 내 위치 버튼 클릭 시 동해시청으로 이동 및 마커 생성
    const handleMyPositionClick = useCallback(() => {
        const map = mapRef.current;
        if (!map) {
            console.warn("지도 인스턴스가 아직 준비되지 않았습니다.");
            alert("지도가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
            return;
        }
        
        const donghaePos = new window.kakao.maps.LatLng(DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON);
        map.setLevel(5); // 줌 레벨 조정
        map.panTo(donghaePos); // 지도 중심 이동

        // 기존 내 위치 마커 제거
        if (myLocationMarkerRef.current) {
            myLocationMarkerRef.current.setMap(null);
        }
        // 클릭 마커 제거
        if (clickMarkerRef.current) {
            clickMarkerRef.current.setMap(null);
        }

        const imageSrc = "/local7Compass1.png";
        const imageSize = new window.kakao.maps.Size(40, 40);
        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, {
            offset: new window.kakao.maps.Point(20, 20)
        });

        const newMarker = new window.kakao.maps.Marker({map: map, position: donghaePos, image: markerImage});
        myLocationMarkerRef.current = newMarker;

        // 3km 필터 (기존 로직 유지)
        const filtered = allRestaurants.filter(r => {
            if (r.restaurantLat && r.restaurantLon) {
                const getDistance = (lat1, lon1, lat2, lon2) => {
                    const R = 6371;
                    const dLat = (lat2 - lat1) * Math.PI / 180;
                    const dLon = (lon2 - lon1) * Math.PI / 180;
                    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(
                        lat2 * Math.PI / 180
                    ) * Math.sin(dLon / 2) ** 2;
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    return R * c;
                };

                const distance = getDistance(
                    DONGHAE_CITY_HALL_LAT,
                    DONGHAE_CITY_HALL_LON,
                    r.restaurantLat,
                    r.restaurantLon
                );
                return distance <= 3;
            }
            return false;
        });

        setFilteredRestaurants(filtered);
    }, [allRestaurants, setFilteredRestaurants]);

    // handleFilterClick (km 버튼 클릭 시 동작)
    const handleFilterClick = useCallback((radius) => {
        const map = mapRef.current;
        if (!map) {
            console.warn("지도 인스턴스가 아직 준비되지 않았습니다.");
            alert("지도가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
            return;
        }
        
        // 기존 클릭 마커 및 내 위치 마커 제거
        if (clickMarkerRef.current) {
            clickMarkerRef.current.setMap(null);
        }
        if (myLocationMarkerRef.current) {
            myLocationMarkerRef.current.setMap(null);
        }

        const center = map.getCenter();
        const centerLat = center.getLat();
        const centerLon = center.getLng();

        // 거리 계산 함수
        const getDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(
                lat2 * Math.PI / 180
            ) * Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        // 지도 줌 레벨 조정
        let level;
        if (radius <= 1) 
            level = 4;
        else if (radius <= 3) 
            level = 5;
        else if (radius <= 10) 
            level = 7;
        else if (radius <= 20) 
            level = 9;
        else 
            level = 9; // 기본값 또는 더 넓은 범위
        
        map.setLevel(level); // 줌 레벨 설정
        map.panTo(center); // 현재 중심 유지

        // 음식점 필터링
        const filtered = allRestaurants.filter(r => {
            if (r.restaurantLat && r.restaurantLon) {
                const distance = getDistance(
                    centerLat,
                    centerLon,
                    r.restaurantLat,
                    r.restaurantLon
                );
                return distance <= radius;
            }
            return false;
        });

        setFilteredRestaurants(filtered);
    }, [allRestaurants, setFilteredRestaurants]);


    return {map: mapRef.current, mapContainerRef, handleMyPositionClick, handleFilterClick};
};

// 3. 페이지네이션
export const usePagination = (items, pageSize) => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = useMemo(
        () => Math.ceil(items.length / pageSize),
        [items.length, pageSize]
    );

    useEffect(() => {
        setCurrentPage(0);
    }, [items]);

    const paginatedItems = useMemo(() => {
        const start = currentPage * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, currentPage, pageSize]);

    const handlePageChange = useCallback((page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    }, [totalPages]);

    return {paginatedItems, currentPage, totalPages, handlePageChange};

};
