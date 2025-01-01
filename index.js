const stations = {
  "ALB": "Albertslund",
  "LI": "Allerød",
  "AVØ": "Avedøre",
  "BAV": "Bagsværd",
  "BA": "Ballerup",
  "BFT": "Bernstorffsvej",
  "BI": "Birkerød",
  "BIT": "Bispebjerg",
  "BSA": "Brøndby Strand",
  "BØT": "Brøndbyøster",
  "BUD": "Buddinge",
  "CB": "Carlsberg",
  "CH": "Charlottenlund",
  "DAH": "Danshøj",
  "DBT": "Dybbølsbro",
  "DYT": "Dyssegård",
  "EGD": "Egedal",
  "EMT": "Emdrup",
  "FM": "Farum",
  "FVT": "Favrholm",
  "FL": "Flintholm",
  "FS": "Frederikssund",
  "FRH": "Friheden",
  "FUT": "Fuglebakken",
  "GJ": "Gentofte",
  "GL": "Glostrup",
  "GRE": "Greve",
  "GHT": "Grøndal",
  "HAR": "Hareskov",
  "HL": "Hellerup",
  "HER": "Herlev",
  "HI": "Hillerød",
  "HOT": "Holte",
  "UND": "Hundige",
  "HUT": "Husum",
  "HIT": "Hvidovre",
  "HTÅ": "Høje Taastrup",
  "IH": "Ishøj",
  "IST": "Islev",
  "JSI": "Jersie",
  "JYT": "Jyllingevej",
  "JÆT": "Jægersborg",
  "KLU": "Karlslunde",
  "KBN": "KB Hallen",
  "KET": "Kildebakke",
  "KID": "Kildedal",
  "KL": "Klampenborg",
  "KH": "København H",
  "NEL": "København Syd",
  "KJ": "Køge",
  "KJN": "Køge Nord",
  "VAT": "Langgade",
  "LY": "Lyngby",
  "MPT": "Malmparken",
  "MW": "Måløv",
  "NHT": "Nordhavn",
  "NØ": "Nørrebro",
  "KN": "Nørreport",
  "OP": "Ordrup",
  "PBT": "Peter Bangs Vej",
  "RYT": "Ryparken",
  "RDO": "Rødovre",
  "SJÆ": "Sjælør",
  "SKT": "Skovbrynet",
  "SKO": "Skovlunde",
  "SOL": "Solrød Strand",
  "SFT": "Sorgenfri",
  "SGT": "Stengården",
  "ST": "Stenløse",
  "SAM": "Svanemøllen",
  "SYV": "Sydhavn",
  "TÅ": "Taastrup",
  "VAL": "Valby",
  "VLB": "Vallensbæk",
  "ANG": "Vangede",
  "VAN": "Vanløse",
  "VS": "Veksø",
  "VPT": "Vesterport",
  "VGT": "Vigerslev Allé",
  "VNG": "Vinge",
  "VIR": "Virum",
  "VÆR": "Værløse",
  "ØLB": "Ølby",
  "ØL": "Ølstykke",
  "KK": "Østerport",
  "ÅLM": "Ålholm",
  "ÅM": "Åmarken",
};

const uniqueTrainIds = new Set();

for (const station in stations) {
  console.log(`${station}: ${stations[station]}`);

  let response = await fetch(`https://api.mittog.dk/api/stog/departure/${station}/?format=json`)
  let data = await response.json();

  for (const train of data.data.Trains) {
    uniqueTrainIds.add(train.TrainId);

    if (train.TOC !== "DSB") {
      console.log(`Train ${train.TrainId} is not operated by DSB`);
    }

    if (train.Product !== "STRAIN") {
      console.log(`Train ${train.TrainId} is not an S-Train`);
    }

    if (train.TargetStation.length > 1) {
      console.log(`Train ${train.TrainId} has multiple target stations`);
    }

    if (train.IsCancelled) {
      console.log(`Train ${train.TrainId} is cancelled`);
    }

    if (train.TrackOriginal !== null) {
      console.log(`Train ${train.TrainId} to ${stations[train.TargetStation[0]]} in ${train.MinutesToDeparture} minutes has changed from track ${train.TrackOriginal} to track ${train.TrackCurrent}`);
    }

    if (train.Routes.length > 2) {
      console.log(`Train ${train.TrainId} has more than 2 routes`);
    }

    for (const route of train.Routes) {
      if (route.UnitType !== "SA" && route.UnitType !== "SE") {
        console.log(`Train ${train.TrainId} has an unknown unit type: ${route.UnitType}`);
      }

      if (!train.IsCancelled) {
        for (const routeStation of route.Stations) {
          if (routeStation.IsCancelled) {
            console.log(`Train ${train.TrainId} to ${stations[train.TargetStation[0]]} in ${train.MinutesToDeparture} minutes is not stopping at ${stations[routeStation.StationId]}`);
          }
        }
      }
    }
  }

  if (data.remarks.length > 0) {
    console.log(`Remarks: ${data.remarks}`);
  }

  if (data.pico.length > 0) {
    console.log(`Pico: ${data.pico}`);
  }
}

const sortedTrainIds = Array.from(uniqueTrainIds).sort();
console.log(`${uniqueTrainIds.size} Train IDs: ${sortedTrainIds.join(', ')}`);
