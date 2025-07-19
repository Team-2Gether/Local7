import {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {fetchAllRestaurants} from '../../../api/RestaurantApi';

// 1. 데이터 상태 관리 및 필터링/정렬 로직을 담당
export const useRestaurants = () => {
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSortBy, setActiveSortBy] = useState(null);

    // 초기 데이터 로드 (컴포넌트 마운트 시 한 번만 실행)
    useEffect(() => {
        const loadData = async () => {
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
        };
        loadData();
    }, []);

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setFilteredRestaurants(allRestaurants);
        } else {
            const results = allRestaurants.filter(
                restaurant => restaurant.restaurantName.includes(searchTerm.trim())
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
        handleSortClick
    };
};

// 2. 지도와 관련된 로직을 담당
export const useMap = (
    allRestaurants,
    setFilteredRestaurants,
    handleRestaurantClick
) => {
    const mapContainerRef = useRef(null);
    const myLocationMarkerRef = useRef(null);
    const [map, setMap] = useState(null);

    const DONGHAE_CITY_HALL_LAT = 37.5255;
    const DONGHAE_CITY_HALL_LON = 129.1147;
    const KAKAO_APP_KEY = '690813b8710fce175e3acf9121422624';

    // 마커 생성 및 클릭 이벤트 등록 함수
    const updateMapMarkers = useCallback((mapInstance, fetchedRestaurants) => {
        if (!mapInstance) 
            return;
        
        // 기존 마커 제거
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

        fetchedRestaurants.forEach((r) => {
            if (r.restaurantLat && r.restaurantLon) {
                const pos = new window
                    .kakao
                    .maps
                    .LatLng(parseFloat(r.restaurantLat), parseFloat(r.restaurantLon));
                const marker = new window
                    .kakao
                    .maps
                    .Marker({map: mapInstance, position: pos, title: r.restaurantName});

                // 마커 클릭 시 모달 열기
                window
                    .kakao
                    .maps
                    .event
                    .addListener(marker, 'click', function () {
                        handleRestaurantClick(r);
                    });
                markers.push(marker);
                bounds.extend(pos);
            }
        });

        if (fetchedRestaurants.length > 0) 
            mapInstance.setBounds(bounds);
        mapInstance.markerList = markers;
    }, [handleRestaurantClick]);

    const filterVisibleRestaurants = useCallback(() => {
        if (!map || allRestaurants.length === 0) 
            return;
        
        const bounds = map.getBounds();
        const visibleRestaurants = allRestaurants.filter(r => {
            if (r.restaurantLat && r.restaurantLon) {
                const pos = new window
                    .kakao
                    .maps
                    .LatLng(parseFloat(r.restaurantLat), parseFloat(r.restaurantLon));
                return bounds.contain(pos);
            }
            return false;
        });
        setFilteredRestaurants(visibleRestaurants);
    }, [map, allRestaurants, setFilteredRestaurants]);

    // '내 위치' 버튼 클릭 시
    const handleMyPositionClick = useCallback(() => {
        if (map) {
            const donghaePosition = new window
                .kakao
                .maps
                .LatLng(DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON);
            map.setLevel(4);
            map.panTo(donghaePosition);

            if (myLocationMarkerRef.current) {
                myLocationMarkerRef
                    .current
                    .setMap(null);
            }
            const imageSrc = "/compass.png";
            const imageSize = new window
                .kakao
                .maps
                .Size(40, 40);
            const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, {
              offset: new window.kakao.maps.Point(20, 20) // 아이콘의 가로/세로 절반 값
            });
            const newMarker = new window
                .kakao
                .maps
                .Marker({map: map, position: donghaePosition, image: markerImage});
            myLocationMarkerRef.current = newMarker;
        }
    }, [map, DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON]);

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(
            lat1 * Math.PI / 180
        ) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // 특정 반경 필터링
    const handleFilterClick = useCallback(
        (radius) => {
            const centerLat = DONGHAE_CITY_HALL_LAT;
            const centerLon = DONGHAE_CITY_HALL_LON;

            const getDistance = (lat1, lon1, lat2, lon2) => {
                const R = 6371;
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(
                    lat1 * Math.PI / 180
                ) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c;
            };

            let mapLevel;
            if (radius <= 1) {
                mapLevel = 3;
            } else if (radius <= 3) {
                mapLevel = 4;
            } else if (radius <= 10) {
                mapLevel = 6;
            } else if (radius <= 20) {
                mapLevel = 9;
            }

            if (map) {
                map.setLevel(mapLevel);
                map.panTo(new window.kakao.maps.LatLng(centerLat, centerLon));
            }

            const newFilteredList = allRestaurants.filter(restaurant => {
                if (restaurant.restaurantLat && restaurant.restaurantLon) {
                    const distance = getDistance(
                        centerLat,
                        centerLon,
                        restaurant.restaurantLat,
                        restaurant.restaurantLon
                    );
                    return distance <= radius;
                }
                return false;
            });

            setFilteredRestaurants(newFilteredList);
        },
        [map, allRestaurants, DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON, setFilteredRestaurants]
    );

    // 지도 스크립트 로드
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
            const script = document.getElementById(mapScriptId);
            if (script) {
                script.remove();
            }
        };
    }, [KAKAO_APP_KEY]);

    // 지도 초기화 및 이벤트 리스너 추가
    // 2. 스크립트 로드 완료 후 지도 생성 및 리스너 등록
    useEffect(() => {
        const container = mapContainerRef.current;
        if (window.kakao && window.kakao.maps && container && !map && allRestaurants.length > 0) {
            const options = {
                center: new window
                    .kakao
                    .maps
                    .LatLng(DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON),
                level: 3
            };
            const createdMap = new window
                .kakao
                .maps
                .Map(container, options);
            setMap(createdMap);

            // 지도 idle 이벤트 리스너 등록
            window
                .kakao
                .maps
                .event
                .addListener(createdMap, 'idle', filterVisibleRestaurants);

            // 초기 마커를 한 번 업데이트
            updateMapMarkers(createdMap, allRestaurants);
        }
    }, [
        map,
        allRestaurants,
        DONGHAE_CITY_HALL_LAT,
        DONGHAE_CITY_HALL_LON,
        updateMapMarkers,
        filterVisibleRestaurants
    ]);

    // 마커 업데이트
    useEffect(() => {
        if (map && allRestaurants.length > 0) {
            updateMapMarkers(map, allRestaurants);
        }
    }, [map, allRestaurants, updateMapMarkers]);

    return {map, mapContainerRef, handleMyPositionClick, handleFilterClick, updateMapMarkers};
};

// 3. 페이지네이션 로직을 담당
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
        const end = start + pageSize;
        return items.slice(start, end);
    }, [items, currentPage, pageSize]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    return {paginatedItems, currentPage, totalPages, handlePageChange};
};