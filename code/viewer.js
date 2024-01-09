// Your access token can be found at: https://ion.cesium.com/tokens.
// Replace `your_access_token` with your Cesium ion access token.
Cesium.Ion.defaultAccessToken = 'your_access_token';

// Création du viewer
let viewer;

// Cette fonction s'active au lancement de l'application. Elle permet d'initialiser le viewer
async function initCesium() {
  viewer = new Cesium.Viewer('cesiumContainer', {
    terrain: Cesium.Terrain.fromWorldTerrain(),
  });

  // Affichage de la ville de Paris au lancement de l'application
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(2.3522, 48.8566, 4000)
  });

  // Ajout des buildings OSM
  const buildingsTileset = await Cesium.createOsmBuildingsAsync();
  viewer.scene.primitives.add(buildingsTileset);

  // Drag and drop - cette fonction à l'air ok
  const cesiumContainer = document.getElementById('cesiumContainer');

  cesiumContainer.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });

  cesiumContainer.addEventListener('drop', function (e) {
    e.preventDefault();

    const files = e.dataTransfer.files;

    if (files.length > 0) {
      const lasFile = files[0];
      const lasFilePath = URL.createObjectURL(lasFile);

      // Vérifie si le fichier a une extension .las
      if (lasFile.name.toLowerCase().endsWith('.las')) {
        loadLocalLasData(viewer, lasFilePath);
      } else {
        console.error('Unsupported file format. Please drop a .las file.');
      }
    }
  });
}

initCesium();


// ##########################################################################################
//                               Récupération des boutons
// ##########################################################################################

var mesureIcon = document.getElementById('mesureIcon')
var downloadIcon = document.getElementById('downloadIcon');

// ##########################################################################################
//                               Ajout d'évènements sur ces boutons
// ##########################################################################################

mesureIcon.addEventListener('click', function() {
  console.log('a');
  enableDistanceMeasurement(viewer)
});

downloadIcon.addEventListener('click', function() {
  console.log('1');
  loadLocalLasData('../data/2540_1181.las')
});

// ##########################################################################################
//                               Ajout du drag and drop
// ##########################################################################################



// ##########################################################################################
//                               Fonctione loading data dans le viewer
//                         --> Cette fonction amène une erreur
// ##########################################################################################

// création d'une variable de type .laz
// var lasFilePath = '../data/LeTeil_Cloud_2007_UTM31N_B2.laz'

function loadLocalLasData(viewer, lasFilePath) {
  const tileset = new Cesium.Cesium3DTileset({
    url: lasFilePath,
  });

  viewer.scene.primitives.add(tileset);

  // Optionally, fly to the loaded data
  viewer.zoomTo(tileset);
}

// ##########################################################################################
//                               Ajout de l'outil de mesure 
// ##########################################################################################


function enableDistanceMeasurement(viewer) {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  let points = [];

  // Supprimer tous les labels existants
  viewer.entities.removeAll();

  handler.setInputAction(function (movement) {
    const ray = viewer.camera.getPickRay(movement.position);
    const position = viewer.scene.globe.pick(ray, viewer.scene);

    if (Cesium.defined(position)) {
      points.push(position);

      if (points.length === 1) {
        // Ajouter un label au premier point
        const labelEntity = viewer.entities.add({
          position: position,
          label: {
            text: 'Point de départ',
            font: '14px sans-serif',
            fillColor: Cesium.Color.RED,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
          },
        });
      }

      if (points.length === 2) {
        // Mesurer la distance entre les deux points
        const distance = Cesium.Cartesian3.distance(points[0], points[1]);

        // Ajouter un label au deuxième point avec la distance mesurée
        const labelEntity = viewer.entities.add({
          position: points[1],
          label: {
            text: `Distance: ${distance.toFixed(2)} m`,
            font: '14px sans-serif',
            fillColor: Cesium.Color.RED,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
          },
        });

        // Désactiver la mesure après deux points
        handler.destroy();
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}




// Ajout d'un layer 

// Add Cesium OSM Buildings, a global 3D buildings layer.
// const buildingTileset = await createOsmBuildingsAsync();
// viewer.scene.primitives.add(buildingTileset);   



// ##########################################################################################
//                                  En commentaire
// ##########################################################################################

