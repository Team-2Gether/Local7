import React, { useEffect, useRef } from "react";

const KakaoMap = ({ address }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(result[0].y, result[0].x),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        new window.kakao.maps.Marker({
          map: map,
          position: options.center,
        });
      }
    });
  }, [address]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default KakaoMap;
