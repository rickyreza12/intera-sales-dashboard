"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
const geoUrl = "/data/custom.geo.json"

export default function MapChart({countryRegionMap, regionMapColors}) {

    const [geographies, setGeographies] = useState(null);

    useEffect(() => {
      fetch(geoUrl)
        .then(res => res.json())
        .then(data => {
          setGeographies(data.features)
        })
    }, [])

    return (
        
              <ComposableMap 
                projectionConfig={{ scale: 120 }}
                width={100}
                height={300}
                style={{width: "100%", height: "100%"}}
                >
                <Geographies geography={geographies}>
                  {({ geographies }) =>
                    geographies.map((geo) => {

                      const isoCode = geo.properties.iso_a3;
                      const region = countryRegionMap[isoCode];
                      const fillColor = regionMapColors[region] || "#E5E7EB";

                      return(
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fillColor}
                          style={{
                            default: {
                              outline: "none",
                              stroke: "#000000",
                              strokeWidth: 0.3,
                              fillOpacity: 0.8,
                              cursor: "pointer"
                            },
                            hover: {
                              fill: "#374151",
                              outline: "none",
                              cursor: "pointer"
                            },
                            pressed: {
                              fill: "#1F2937",
                              outline: "none"
                            }
                          }}
                          onMouseEnter={() =>{
                            const iso = geo.properties.iso_a3;
                            const region = countryRegionMap[iso] || 'None';
                            console.log(`${geo.properties.name} [${iso}] => ${region}`);
                          }}
                        />
                      )
                    })
                  }
                </Geographies>
              </ComposableMap>
            
    )
}