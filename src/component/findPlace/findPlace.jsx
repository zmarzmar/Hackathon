import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

export default function FindPlace() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [parkFacilities, setParkFacilities] = useState([]);
  const [healthFacilities, setHealthFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    // 사용자의 현재 위치 정보 가져오기
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    if (currentLocation) {
      // 현재 위치 기준으로 공원과 헬스 시설 정보 가져오기
      fetchPlaces(currentLocation);
    }
  }, [currentLocation]);

  const fetchPlaces = async (location) => {
    try {
      // 카카오 Local API를 사용하여 공원과 헬스 시설 정보 가져오기
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?x=${location.lng}&y=${location.lat}&radius=5000&query=공원`,
        {
          headers: {
            Authorization: 'KakaoAK de534ad8a6c23d715eaf602c76382205',
          },
        }
      );
      const data = await response.json();

      const response2 = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?x=${location.lng}&y=${location.lat}&radius=5000&query=운동`,
        {
          headers: {
            Authorization: 'KakaoAK de534ad8a6c23d715eaf602c76382205',
          },
        }
      );
      const data2 = await response2.json();

      // 공원과 헬스 시설을 구분하여 상태에 저장
      const parks = data.documents.filter((doc) => doc.category_name.includes('공원'));
      const healths = data2.documents.filter((doc) => doc.category_name.includes('운동'));
      setParkFacilities(parks);
      setHealthFacilities(healths);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const handleFacilityClick = (facility) => {
    setSelectedFacility(facility);
  };

  return (
    <div style={{ width: '390px' }}>
      {currentLocation && (
        <Map
          center={{
            lat: currentLocation.lat,
            lng: currentLocation.lng,
          }}
          level={4}
          style={{
            width: '100%',
            height: '500px',
          }}
        >
          {parkFacilities.map((facility) => (
            <MapMarker
              key={facility.id}
              position={{
                lat: facility.y,
                lng: facility.x,
              }}
              onClick={() => handleFacilityClick(facility)}
            />
          ))}
          {healthFacilities.map((facility) => (
            <MapMarker
              key={facility.id}
              position={{
                lat: facility.y,
                lng: facility.x,
              }}
              onClick={() => handleFacilityClick(facility)}
            />
          ))}
          {selectedFacility && (
            <Map
              center={{
                lat: selectedFacility.y,
                lng: selectedFacility.x,
              }}
              level={4}
              style={{
                width: '100%',
                height: '500px',
              }}
            >
              <MapMarker
                position={{
                  lat: selectedFacility.y,
                  lng: selectedFacility.x,
                }}
              />
            </Map>
          )}
        </Map>
      )}
      <div>
        {parkFacilities.map((facility) => (
          <div key={facility.id} >
            {facility.place_name}
          </div>
        ))}
        {healthFacilities.map((facility) => (
          <div key={facility.id}>
            {facility.place_name}
          </div>
        ))}
      </div>
    </div>
  );
}
