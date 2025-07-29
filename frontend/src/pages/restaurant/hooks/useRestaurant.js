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
            setFilteredRestaurants(data); 
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
        activeSortBy,
        handleSortClick,
        refetchRestaurants,
    };
};

// 2. 지도 기능
export const useMap = (
    allRestaurants,
    setFilteredRestaurants,
    handleRestaurantClick,
    isKakaoMapLoaded 
) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null); // 지도 인스턴스
    const myLocationMarkerRef = useRef(null); // 내 위치 마커
    const clickMarkerRef = useRef(null); // 클릭한 위치 마커
    const markersRef = useRef([]); // 음식점 마커들을 관리할 배열
    const infoWindowRef = useRef(null); // 인포윈도우 인스턴스

    const DONGHAE_CITY_HALL_LAT = 37.5255;
    const DONGHAE_CITY_HALL_LON = 129.1147;

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
    }, [handleRestaurantClick]);

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

    // 지도 생성 및 초기화 
    useEffect(() => {
        const container = mapContainerRef.current;
       
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

        // 클린업 함수: 컴포넌트 언마운트 시 또는 의존성 변경 시 지도 인스턴스 정리
        return () => {
            if (mapRef.current) {
                // 모든 마커 제거
                markersRef.current.forEach(marker => marker.setMap(null));
                markersRef.current = [];

                if (myLocationMarkerRef.current) {
                    myLocationMarkerRef.current.setMap(null);
                    myLocationMarkerRef.current = null;
                }
                if (clickMarkerRef.current) {
                    clickMarkerRef.current.setMap(null);
                    clickMarkerRef.current = null;
                }
                if (infoWindowRef.current) {
                    infoWindowRef.current.close();
                    infoWindowRef.current = null;
                }

                // 지도 인스턴스 참조 해제 
                mapRef.current = null;
            }
        };
    }, [isKakaoMapLoaded, allRestaurants, filterVisibleRestaurants, updateMapMarkers]);

    // 클릭 시 마커 및 반경 필터링 
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        
        // 이벤트 리스너를 추가하고, 클린업 함수에서 제거하는 방식으로 변경
        const clickListener = window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
            const latlng = mouseEvent.latLng;
            const imageSrc = '/local7Compass1.png'; // 사용할 이미지 경로 
            const imageSize = new window.kakao.maps.Size(40, 40); // 마커 이미지의 크기
            const imageOption = {
                offset: new window.kakao.maps.Point(20, 40)
            };

            const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            // 클릭 마커 중복 제거
            if (clickMarkerRef.current) {
                clickMarkerRef.current.setMap(null);
            }
            // 내 위치 마커 제거: 지도 클릭 시 내 위치 마커도 사라지도록 추가
            if (myLocationMarkerRef.current) {
                myLocationMarkerRef.current.setMap(null);
                myLocationMarkerRef.current = null;
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
                    return distance <= 10; // 10km 반경 필터링 
                }
                return false;
            });

            setFilteredRestaurants(filtered);
        });

        // 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            // mapRef.current가 null이 아닐 때만 removeListener 호출
            if (mapRef.current) {
                window.kakao.maps.event.removeListener(map, 'click', clickListener);
            }
        };
    }, [allRestaurants, setFilteredRestaurants, handleRestaurantClick, myLocationMarkerRef]); // myLocationMarkerRef 의존성 추가

    // 내 위치 버튼 클릭 시 동해시청으로 이동 및 마커 생성
    const handleMyPositionClick = useCallback(() => {
        const map = mapRef.current;
        if (!map) {
            console.warn("지도 인스턴스가 아직 준비되지 않았습니다.");
            alert("지도가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
            return;
        }
        
        const donghaePos = new window.kakao.maps.LatLng(DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON);
        map.setLevel(5); 
        map.panTo(donghaePos); 

        // 기존 내 위치 마커 제거 
        if (myLocationMarkerRef.current) {
            myLocationMarkerRef.current.setMap(null);
            myLocationMarkerRef.current = null;
        }
        // 클릭 마커 제거 
        if (clickMarkerRef.current) {
            clickMarkerRef.current.setMap(null);
            clickMarkerRef.current = null;
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
        
        // 클릭 마커 제거 (이 부분은 유지)
        if (clickMarkerRef.current) {
            clickMarkerRef.current.setMap(null);
            clickMarkerRef.current = null;
        }

        // 필터링의 중심점 설정:
        // '내 위치' 마커가 존재한다면 그 위치를, 아니면 동해 시청 위치를 필터의 중심으로 사용
        let filterCenterLat = DONGHAE_CITY_HALL_LAT;
        let filterCenterLon = DONGHAE_CITY_HALL_LON;
        let mapCenter = new window.kakao.maps.LatLng(DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON);

        if (myLocationMarkerRef.current) {
            const myPos = myLocationMarkerRef.current.getPosition();
            filterCenterLat = myPos.getLat();
            filterCenterLon = myPos.getLng();
            mapCenter = myPos;
        } else {
            // '내 위치' 마커가 없다면, 현재 지도의 중심을 필터의 중심으로 사용 
            const currentMapCenter = map.getCenter();
            filterCenterLat = currentMapCenter.getLat();
            filterCenterLon = currentMapCenter.getLng();
            mapCenter = currentMapCenter;
        }

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
            level = 9; 
        
        map.setLevel(level); 
        map.panTo(mapCenter); 

        // 음식점 필터링
        const filtered = allRestaurants.filter(r => {
            if (r.restaurantLat && r.restaurantLon) {
                const distance = getDistance(
                    filterCenterLat,
                    filterCenterLon,
                    r.restaurantLat,
                    r.restaurantLon
                );
                return distance <= radius;
            }
            return false;
        });

        setFilteredRestaurants(filtered);
    }, [allRestaurants, setFilteredRestaurants, myLocationMarkerRef]); // myLocationMarkerRef 의존성 추가


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
