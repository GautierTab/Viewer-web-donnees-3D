window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));
		
viewer.setEDLEnabled(false); // Eye Dome Lighting, pour l'éclairage
viewer.setFOV(60); // Angle de champ
viewer.setPointBudget(1_000_000); // Limite du nombre de points
viewer.loadSettingsFromURL(); // Charge les paramètres par défault de la barre d'outils
viewer.setBackground("skybox"); // Background du viewer
		
viewer.setDescription("Projet Informatique PPMD Gautier TABORDET");
		
viewer.loadGUI(() => {
	viewer.setLanguage('en');
	$("#menu_tools").next().show();
	$("#menu_clipping").next().show();
	viewer.toggleSidebar();
});
		

// // Pour ajouter un nuage de point par défaut 
// Potree.loadPointCloud("../Potree_1.8.2/Potree_1.8.2/pointclouds/vol_total/cloud.js", "sigeom.sa", e => {
// 	let scene = viewer.scene;
// 	let pointcloud = e.pointcloud;
			
// 	let material = pointcloud.material;
// 	material.size = 1;
// 	material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
// 	material.shape = Potree.PointShape.SQUARE;
	
// 	scene.addPointCloud(pointcloud);
			
// 	viewer.fitToScreen();
	// scene.view.setView(
	// 	[589974.341, 231698.397, 986.146],
	// 	[589851.587, 231428.213, 715.634],
	// );
// });
