import {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {fetchAllRestaurants} from '../../../api/RestaurantApi';

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

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setFilteredRestaurants(allRestaurants);
        } else {
            const results = allRestaurants.filter(
                r => r.restaurantName.includes(searchTerm.trim())
            );
            setFilteredRestaurants(results);
        }
    };

    const handleShowAllRestaurants = () => {
        setSearchTerm('');
        setFilteredRestaurants(allRestaurants);
    };

    const handleSortClick = (sortBy) => {
        const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
            if (sortBy === 'rating') {
                return b.averageRating - a.averageRating;
            } else if (sortBy === 'comments') {
                return b.totalComments - a.totalComments;
            }
            return 0;
        });
        setFilteredRestaurants(sortedRestaurants);
        setActiveSortBy(sortBy);
    };

    return {
        allRestaurants,
        filteredRestaurants,
        setFilteredRestaurants,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        handleSearch,
        handleShowAllRestaurants,
        activeSortBy,
        handleSortClick,
        refetchRestaurants: loadData
    };
};

// 2. 지도 기능
export const useMap = (
    allRestaurants,
    setFilteredRestaurants,
    handleRestaurantClick
) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const myLocationMarkerRef = useRef(null);
    const clickMarkerRef = useRef(null);

    const DONGHAE_CITY_HALL_LAT = 37.5255;
    const DONGHAE_CITY_HALL_LON = 129.1147;
    const KAKAO_APP_KEY = '690813b8710fce175e3acf9121422624';

    // 음식점 마커 표시 함수
    const updateMapMarkers = useCallback((mapInstance, restaurants) => {
        if (!mapInstance) 
            return;
        
        if (mapInstance.markerList) {
            mapInstance
                .markerList
                .forEach(marker => marker.setMap(null));
        }

        const bounds = new window
            .kakao
            .maps
            .LatLngBounds();
        const markers = [];

        restaurants.forEach((r) => {
            if (r.restaurantLat && r.restaurantLon) {
                const pos = new window
                    .kakao
                    .maps
                    .LatLng(+r.restaurantLat, + r.restaurantLon);
                const marker = new window
                    .kakao
                    .maps
                    .Marker({map: mapInstance, position: pos, title: r.restaurantName});

                window
                    .kakao
                    .maps
                    .event
                    .addListener(marker, 'click', () => {
                        handleRestaurantClick(r);
                    });

                markers.push(marker);
                bounds.extend(pos);
            }
        });

        if (restaurants.length > 0) {
            mapInstance.setBounds(bounds);
        }

        mapInstance.markerList = markers;
    }, [handleRestaurantClick]);

    const handleFilterClick = useCallback((radius) => {
        const map = mapRef.current;
        if (!map || !allRestaurants.length) 
            return;
        
        if (clickMarkerRef.current) {
            clickMarkerRef.current.setMap(null);
            clickMarkerRef.current = null;
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
            level = 9;
        
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

    // 지도의 idle 상태일 때 보이는 음식점 필터링
    const filterVisibleRestaurants = useCallback(() => {
        const map = mapRef.current;
        if (!map || allRestaurants.length === 0) 
            return;
        
        const bounds = map.getBounds();
        const visibleRestaurants = allRestaurants.filter(r => {
            if (r.restaurantLat && r.restaurantLon) {
                const pos = new window
                    .kakao
                    .maps
                    .LatLng(+r.restaurantLat, + r.restaurantLon);
                return bounds.contain(pos);
            }
            return false;
        });

        setFilteredRestaurants(visibleRestaurants);
    }, [allRestaurants, setFilteredRestaurants]);

    // 클릭 시 마커 및 반경 10km 음식점 필터링
    useEffect(() => {
        const map = mapRef.current;
        if (!map) 
            return;
        
        window
            .kakao
            .maps
            .event
            .addListener(map, 'click', function (mouseEvent) {
                const latlng = mouseEvent.latLng;
                const imageSrc = '/local7Compass1.png'; // 사용할 이미지 경로 (public 폴더 기준)
                const imageSize = new window
                    .kakao
                    .maps
                    .Size(40, 40); // 마커 이미지의 크기
                const imageOption = {
                    offset: new window
                        .kakao
                        .maps
                        .Point(20, 40)
                };

                const markerImage = new window
                    .kakao
                    .maps
                    .MarkerImage(imageSrc, imageSize, imageOption);

                // 클릭 마커 중복 제거
                if (clickMarkerRef.current) {
                    clickMarkerRef
                        .current
                        .setMap(null);
                }

                if (myLocationMarkerRef.current) {
                    myLocationMarkerRef.current.setMap(null);
                }

                const marker = new window
                    .kakao
                    .maps
                    .Marker({map: map, position: latlng, image: markerImage});
                clickMarkerRef.current = marker;

                // 마커 클릭 이벤트
                window
                    .kakao
                    .maps
                    .event
                    .addListener(marker, 'click', function () {
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
                        return distance <= 10;
                    }
                    return false;
                });

                setFilteredRestaurants(filtered);
            });
    }, [allRestaurants, setFilteredRestaurants, handleRestaurantClick]);

    // 내 위치 버튼 클릭 시 동해시청으로 이동 및 마커 생성
    const handleMyPositionClick = useCallback(() => {
        const map = mapRef.current;
        if (!map) 
            return;
        
        const donghaePos = new window
            .kakao
            .maps
            .LatLng(DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON);
        map.setLevel(5);
        map.panTo(donghaePos);

        // 기존 내 위치 마커 제거
        if (myLocationMarkerRef.current) {
            myLocationMarkerRef
                .current
                .setMap(null);
            clickMarkerRef.current = null;
        }

        const imageSrc = "/local7Compass1.png";
        const imageSize = new window
            .kakao
            .maps
            .Size(40, 40);
        const markerImage = new window
            .kakao
            .maps
            .MarkerImage(imageSrc, imageSize, {
                offset: new window
                    .kakao
                    .maps
                    .Point(20, 20)
            });

        const newMarker = new window
            .kakao
            .maps
            .Marker({map: map, position: donghaePos, image: markerImage});

        myLocationMarkerRef.current = newMarker;

        // 3km 필터
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

    // 스크립트 로드
    useEffect(() => {
        const mapScriptId = "kakao-map-script";
        if (document.getElementById(mapScriptId)) 
            return;
        
        const script = document.createElement("script");
        script.id = mapScriptId;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services`;
        script.async = true;
        document
            .head
            .appendChild(script);

        return() => {
            const s = document.getElementById(mapScriptId);
            if (s) 
                s.remove();
            };
    }, []);

    // 지도 생성 및 초기화
    useEffect(() => {
        const container = mapContainerRef.current;
        if (window.kakao && window.kakao.maps && container && !mapRef.current && allRestaurants.length > 0) {
            const map = new window
                .kakao
                .maps
                .Map(container, {
                    center: new window
                        .kakao
                        .maps
                        .LatLng(DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON),
                    level: 3
                });

            mapRef.current = map;

            window
                .kakao
                .maps
                .event
                .addListener(map, 'idle', filterVisibleRestaurants);
            updateMapMarkers(map, allRestaurants);
        }
    }, [allRestaurants, filterVisibleRestaurants, updateMapMarkers]);

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
