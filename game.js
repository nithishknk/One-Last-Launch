var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true, { stencil: false, preserveDrawingBuffer: false, powerPreference: "high-performance" }, false);
engine.setHardwareScalingLevel(window.devicePixelRatio > 1.5 ? 1.5 : 1);

var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    // ⚡ PERFORMANCE OPTIMIZATIONS
    scene.autoClear = false;
    scene.autoClearDepthAndStencil = false;
    scene.blockMaterialDirtyMechanism = true;
    scene.skipPointerMovePicking = true;
    scene.pointerMovePredicate = () => false;
    scene.useGeometryIdsMap = true;
    scene.useMaterialMeshMap = true;
    scene.useClonedMeshMap = true;
    scene.renderTargetsEnabled = false;
    scene.lensFlaresEnabled = false;
    scene.probesEnabled = false;
    scene.proceduralTexturesEnabled = false;

    // ☁️ SKY & LIGHTING (Darkened for the apocalyptic storm)

    scene.clearColor = new BABYLON.Color3(0.01, 0.01, 0.02); // Much darker for night sky
    scene.collisionsEnabled = true;

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);



    light.intensity = 0.35; // Slightly increased for visibility in night
    light.diffuse = new BABYLON.Color3(0.20, 0.22, 0.25); // Darker grey-blue light
    light.groundColor = new BABYLON.Color3(0.03, 0.03, 0.04);

    // ===== 🟢 HEALTH BAR UI =====
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var healthBarBg = new BABYLON.GUI.Rectangle();
    healthBarBg.width = "300px";
    healthBarBg.height = "30px";
    healthBarBg.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    healthBarBg.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    healthBarBg.left = "20px";
    healthBarBg.top = "20px";
    healthBarBg.background = "black";
    healthBarBg.thickness = 2;
    advancedTexture.addControl(healthBarBg);

    var healthBarInner = new BABYLON.GUI.Rectangle();
    healthBarInner.width = "100%";
    healthBarInner.height = "100%";
    healthBarInner.background = "#2ecc71";
    healthBarInner.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    healthBarInner.thickness = 0;
    healthBarBg.addControl(healthBarInner);

    var maxHealth = 100;
    var currentHealth = maxHealth;

    // ===== ROAD MATERIALS =====
    var roadMat = new BABYLON.StandardMaterial("roadMat", scene);
    var roadTexture = new BABYLON.Texture("road.jpg", scene);
    roadTexture.uScale = 1;
    roadTexture.vScale = 5;
    roadTexture.anisotropicFilteringLevel = 16;
    roadTexture.updateSamplingMode(BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
    roadMat.diffuseTexture = roadTexture;
    roadMat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    roadMat.zOffset = -3;

    var road2Mat = new BABYLON.StandardMaterial("road2Mat", scene);
    var road2Texture = new BABYLON.Texture("road2.jpg", scene);
    road2Texture.uScale = 150;
    road2Texture.vScale = 150;
    road2Texture.anisotropicFilteringLevel = 16;
    road2Texture.updateSamplingMode(BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
    road2Mat.diffuseTexture = road2Texture;
    road2Mat.specularColor = new BABYLON.Color3(0.02, 0.02, 0.02);

    var groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.22, 0.22, 0.22);

    // ===== ROAD MATERIAL FOR PLATFORMS (replaces grey base) =====
    var platformRoadMat = new BABYLON.StandardMaterial("platformRoadMat", scene);
    var platformRoadTex = new BABYLON.Texture("road2.jpg", scene);
    platformRoadTex.uScale = 8;
    platformRoadTex.vScale = 8;
    platformRoadTex.anisotropicFilteringLevel = 16;
    platformRoadTex.updateSamplingMode(BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
    platformRoadMat.diffuseTexture = platformRoadTex;
    platformRoadMat.specularColor = new BABYLON.Color3(0.02, 0.02, 0.02);


    // ===== ORIGINAL WALL TEXTURE (for cramped right side) =====
    var aiBuildingMat = new BABYLON.StandardMaterial("aiBuildingMat", scene);
    var aiTexture = new BABYLON.Texture("wall.jpg", scene);
    aiTexture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
    aiTexture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
    aiTexture.anisotropicFilteringLevel = 16;
    aiBuildingMat.diffuseTexture = aiTexture;
    aiBuildingMat.specularColor = new BABYLON.Color3(0, 0, 0);

    // ===== NEW WALL2 TEXTURE (for posh grid left side) =====
    var wall2Mat = new BABYLON.StandardMaterial("wall2Mat", scene);
    var wall2Texture = new BABYLON.Texture("wall2.jpg", scene);
    wall2Texture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
    wall2Texture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
    wall2Texture.anisotropicFilteringLevel = 16;
    wall2Mat.diffuseTexture = wall2Texture;
    wall2Mat.specularColor = new BABYLON.Color3(0, 0, 0);

    // ===== FOREST LAND (textured green ground) =====
    var forestMat = new BABYLON.StandardMaterial("forestMat", scene);
    var greenGroundTex = new BABYLON.Texture("green ground.jpg", scene);
    greenGroundTex.uScale = 15;
    greenGroundTex.vScale = 80;
    greenGroundTex.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
    greenGroundTex.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
    greenGroundTex.anisotropicFilteringLevel = 16;
    greenGroundTex.updateSamplingMode(BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
    forestMat.diffuseTexture = greenGroundTex;
    forestMat.specularColor = new BABYLON.Color3(0, 0, 0);

    // ===== TOP WALL TEXTURE (for building roofs) =====
    var topWallMat = new BABYLON.StandardMaterial("topWallMat", scene);
    var topWallTex = new BABYLON.Texture("top wall.jpg", scene);
    topWallTex.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
    topWallTex.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
    topWallTex.anisotropicFilteringLevel = 16;
    topWallMat.diffuseTexture = topWallTex;
    topWallMat.specularColor = new BABYLON.Color3(0, 0, 0);

    // ⚡ FREEZE ALL MATERIALS (prevents per-frame shader recompilation checks)
    roadMat.freeze();
    road2Mat.freeze();
    groundMat.freeze();
    platformRoadMat.freeze();
    aiBuildingMat.freeze();
    wall2Mat.freeze();
    forestMat.freeze();
    topWallMat.freeze();

    // ===== LEFT SIDE GROUND (extended base) =====
    var groundLeft = BABYLON.MeshBuilder.CreateGround("groundLeft", { width: 800, height: 800 }, scene);
    groundLeft.position.y = -0.48;
    groundLeft.position.x = -400; // Spans exactly from 0 to -800
    groundLeft.material = forestMat; // Natively purely green!
    groundLeft.checkCollisions = true;
    groundLeft.freezeWorldMatrix();

    // ===== RIGHT SIDE GROUND (cramped city base) =====
    var groundRight = BABYLON.MeshBuilder.CreateGround("groundRight", { width: 800, height: 800 }, scene);
    groundRight.position.y = -0.48;
    groundRight.position.x = 400; // Stretch the base far away!
    groundRight.material = forestMat; // Natively purely green!
    groundRight.checkCollisions = true;
    groundRight.freezeWorldMatrix();

    // 🔥 THE OPTIMIZED BUILDING FUNCTION (roof uses top wall texture via multi-material) =====
    function createBuilding(name, x, z, w, h, d, mat) {
        let texScale = 25;
        var faceUV = new Array(6);

        // Babylon box face order: 0=back, 1=front, 2=right, 3=left, 4=top, 5=bottom
        faceUV[0] = new BABYLON.Vector4(0, 0, w / texScale, h / texScale);
        faceUV[1] = new BABYLON.Vector4(0, 0, w / texScale, h / texScale);
        faceUV[2] = new BABYLON.Vector4(0, 0, d / texScale, h / texScale);
        faceUV[3] = new BABYLON.Vector4(0, 0, d / texScale, h / texScale);
        faceUV[4] = new BABYLON.Vector4(0, 0, w / texScale, d / texScale);
        faceUV[5] = new BABYLON.Vector4(0, 0, w / texScale, d / texScale);

        let building = BABYLON.MeshBuilder.CreateBox("climbable", {
            width: w,
            height: h,
            depth: d,
            faceUV: faceUV
        }, scene);

        building.position.x = x;
        building.position.z = z;
        building.position.y = h / 2;

        // Multi-material: walls use the given mat, top uses topWallMat
        var multiMat = new BABYLON.MultiMaterial("multi_" + name, scene);
        multiMat.subMaterials = [mat, topWallMat];
        building.material = multiMat;

        // Assign sub-mesh indices: faces 0-3 (walls) + face 5 (bottom) = sub 0, face 4 (top) = sub 1
        building.subMeshes = [];
        var verticesCount = building.getTotalVertices();
        // Walls + bottom: indices 0 to 24 (faces 0-3) and 30-35 (face 5)
        building.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 24, building));
        building.subMeshes.push(new BABYLON.SubMesh(1, 0, verticesCount, 24, 6, building));
        building.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 30, 6, building));

        building.checkCollisions = true;
        building.isPickable = false;
        building.freezeWorldMatrix();
    }

    // ===== HYBRID ZONE CITY GENERATOR =====
    var spacing = 80;
    var mainRoadWidth = 24;
    var numBlocks = 5;
    let segmentLength = spacing - mainRoadWidth;

    // --- ROADS FOR LEFT-SIDE SMALL TOWN (Embedded in forest corner) ---
    // Placed far out in the very left corner of the extended base!
    let townCenterX = -650;
    let townCenterZ = -300;
    let smallRoadWidth = 24;   // Made town roads wider
    let smallStreetLength = 180; // Extended town roads to fit wider layout

    // Circular Ring Road exactly around the town limits!
    let ringRoad = BABYLON.MeshBuilder.CreateTorus("townRingRoad", {
        diameter: 160,
        thickness: 24,
        tessellation: 64
    }, scene);
    ringRoad.position = new BABYLON.Vector3(townCenterX, 0.02, townCenterZ);
    ringRoad.scaling.y = 0.005; // Flatten into a pure ground road
    ringRoad.material = road2Mat;
    ringRoad.checkCollisions = false;
    ringRoad.freezeWorldMatrix();

    // Main street Z-axis
    let mainSt = BABYLON.MeshBuilder.CreateGround("townRoadMain", { width: smallRoadWidth, height: smallStreetLength }, scene);
    mainSt.position = new BABYLON.Vector3(townCenterX, -0.45, townCenterZ);
    mainSt.material = roadMat;
    mainSt.checkCollisions = true;
    mainSt.freezeWorldMatrix();

    // Cross street X-axis
    let crossSt = BABYLON.MeshBuilder.CreateGround("townRoadCross", { width: smallRoadWidth, height: smallStreetLength }, scene);
    crossSt.position = new BABYLON.Vector3(townCenterX, -0.44, townCenterZ);
    crossSt.rotation.y = Math.PI / 2;
    crossSt.material = roadMat;
    crossSt.checkCollisions = true;
    crossSt.freezeWorldMatrix();

    // ===== MIDDLE GAP OPTIMIZATION: ONE SINGLE GROUND PLANE =====
    var apocalypticMat = new BABYLON.StandardMaterial("apocalypticMat", scene);
    var wastelandTex = new BABYLON.Texture("green ground.jpg", scene); // Using existing green ground but visually scaled as overgrown/cracked
    wastelandTex.uScale = 10;
    wastelandTex.vScale = 10;
    wastelandTex.anisotropicFilteringLevel = 16;
    wastelandTex.updateSamplingMode(BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
    apocalypticMat.diffuseTexture = wastelandTex;
    apocalypticMat.diffuseColor = new BABYLON.Color3(0.5, 0.6, 0.4); // Darkened, dead apocalyptic tint
    apocalypticMat.specularColor = new BABYLON.Color3(0.02, 0.02, 0.02);
    apocalypticMat.freeze();

    // The single massive ground plane for the gap! (Zero lag compared to thousands of grass blades)
    var middleGround = BABYLON.MeshBuilder.CreateGround("middleGround", { width: 500, height: 760 }, scene);
    middleGround.position = new BABYLON.Vector3(-150, -0.4, 0); // Spans x: -400 to 100, z: -380 to 380!
    middleGround.material = apocalypticMat;
    middleGround.checkCollisions = true;
    middleGround.freezeWorldMatrix(); // Lock for maximum static performance

    // ===== GRASS SYSTEM (Same optimized approach as trees!) =====
    BABYLON.SceneLoader.ImportMesh("", "./", "single grass.glb", scene, (meshes) => {
        let grassMaster = meshes[0];
        grassMaster.position = BABYLON.Vector3.Zero();
        grassMaster.rotation = BABYLON.Vector3.Zero();
        grassMaster.scaling = BABYLON.Vector3.One();
        grassMaster.computeWorldMatrix(true);

        // Merge into a single lightweight mesh for createInstance()
        let actualGrass = grassMaster.getChildMeshes().filter(m => m instanceof BABYLON.Mesh && m.getTotalVertices() > 0);
        actualGrass.forEach(m => m.computeWorldMatrix(true));
        let singleGrassMesh = BABYLON.Mesh.MergeMeshes(actualGrass, false, true, undefined, false, true);

        // Hide the master mesh
        singleGrassMesh.position = new BABYLON.Vector3(0, -5000, 0);
        singleGrassMesh.isVisible = false;
        singleGrassMesh.checkCollisions = false;
        grassMaster.dispose();

        let grassIdx = 0;

        // --- GROUP 1: Dense grass covering the small town area and roads ---
        for (let i = 0; i < 60; i++) {
            let gx = townCenterX - 120 + Math.random() * 240; // x: -770 to -530 (around town)
            let gz = townCenterZ - 120 + Math.random() * 240; // z: -420 to -180 (around town)

            let g = singleGrassMesh.createInstance("grass_town_" + grassIdx++);
            let s = 3.0 + Math.random() * 5.0; // Small to medium sized grass
            g.scaling = new BABYLON.Vector3(s, s, s);
            g.position = new BABYLON.Vector3(gx, -0.4, gz);
            g.rotation = new BABYLON.Vector3(0, Math.random() * Math.PI * 2, 0);
            g.checkCollisions = false;
            g.freezeWorldMatrix();
        }

        // --- GROUP 2: Grass growing on the town roads (overgrown apocalyptic feel) ---
        for (let i = 0; i < 25; i++) {
            // Scatter directly on the cross-roads of the small town
            let onMainRoad = Math.random() > 0.5;
            let gx, gz;
            if (onMainRoad) {
                gx = townCenterX + (Math.random() - 0.5) * 12; // On main street
                gz = townCenterZ - 90 + Math.random() * 180;
            } else {
                gx = townCenterX - 90 + Math.random() * 180; // On cross street
                gz = townCenterZ + (Math.random() - 0.5) * 12;
            }

            let g = singleGrassMesh.createInstance("grass_road_" + grassIdx++);
            let s = 2.0 + Math.random() * 3.0; // Smaller grass poking through road cracks
            g.scaling = new BABYLON.Vector3(s, s, s);
            g.position = new BABYLON.Vector3(gx, -0.3, gz);
            g.rotation = new BABYLON.Vector3(0, Math.random() * Math.PI * 2, 0);
            g.checkCollisions = false;
            g.freezeWorldMatrix();
        }

        // --- GROUP 3: Sparse grass trailing outward from the town toward the middle ---
        for (let i = 0; i < 30; i++) {
            let gx = townCenterX + 80 + Math.random() * 300; // x: -570 to -270 (trailing east)
            let gz = townCenterZ - 200 + Math.random() * 400;

            let g = singleGrassMesh.createInstance("grass_trail_" + grassIdx++);
            let s = 4.0 + Math.random() * 7.0; // Bigger grass as it grows wild away from town
            g.scaling = new BABYLON.Vector3(s, s, s);
            g.position = new BABYLON.Vector3(gx, -0.4, gz);
            g.rotation = new BABYLON.Vector3(0, Math.random() * Math.PI * 2, 0);
            g.checkCollisions = false;
            g.freezeWorldMatrix();
        }
    });

    // 2. Load Tree2 to use as massive apocalyptic debris/rubble props!
    BABYLON.SceneLoader.ImportMesh("", "./", "tree2.glb", scene, (meshes) => {
        const treeMaster = meshes[0];
        treeMaster.position = BABYLON.Vector3.Zero();
        treeMaster.rotation = BABYLON.Vector3.Zero();
        treeMaster.scaling = BABYLON.Vector3.One();
        treeMaster.computeWorldMatrix(true);

        let actualMeshes = treeMaster.getChildMeshes().filter(m => m instanceof BABYLON.Mesh && m.getTotalVertices() > 0);
        actualMeshes.forEach(m => m.computeWorldMatrix(true));
        let singleTreeMesh = BABYLON.Mesh.MergeMeshes(actualMeshes, false, true, undefined, false, true);

        // Hide and bury the master single mesh
        singleTreeMesh.position = new BABYLON.Vector3(0, -5000, 0);
        singleTreeMesh.isVisible = false;
        singleTreeMesh.checkCollisions = false;
        treeMaster.dispose();

        let numProps = 50; // 30 at city entrance + 20 spread across the middle

        // --- GROUP 1: 30 trees clustered at the entrance of the cramped city ---
        for (let i = 0; i < 30; i++) {
            let px = 80 + Math.random() * 220;  // x: 80 to 300 (cramped city entrance)
            let pz = -350 + Math.random() * 700; // z: -350 to +350 (wide spread along the entrance)

            let propInstance = singleTreeMesh.createInstance("tree_entrance_" + i);
            let size = 0.15;
            propInstance.scaling = new BABYLON.Vector3(size, size, size);
            propInstance.position = new BABYLON.Vector3(px, -0.5, pz);
            propInstance.rotation = new BABYLON.Vector3(0, Math.random() * Math.PI * 2, 0);
            propInstance.checkCollisions = false; // No lag from collisions!
            propInstance.freezeWorldMatrix();
        }

        // --- GROUP 2: 20 trees spread widely across the middle wasteland ---
        for (let i = 0; i < 20; i++) {
            let px = -380 + Math.random() * 440;  // x: -380 to +60 (wide middle area)
            let pz = -350 + Math.random() * 700;  // z: -350 to +350

            let propInstance = singleTreeMesh.createInstance("tree_middle_" + i);
            let size = 0.15;
            propInstance.scaling = new BABYLON.Vector3(size, size, size);
            propInstance.position = new BABYLON.Vector3(px, -0.5, pz);
            propInstance.rotation = new BABYLON.Vector3(0, Math.random() * Math.PI * 2, 0);
            propInstance.checkCollisions = false;
            propInstance.freezeWorldMatrix();
        }

        // --- GROUP 3: 6 extra trees clustered in the center of the grid base (avoiding generator) ---
        let treesPlaced = 0;
        let maxAttempts = 50; // Prevent infinite loop
        let attempts = 0;

        while (treesPlaced < 6 && attempts < maxAttempts) {
            let px = -15 + Math.random() * 30; // x: -15 to 15 (Centered on 0)
            let pz = -15 + Math.random() * 30; // z: -15 to 15 (Centered on 0)
            
            // Check if too close to generator at (0,0) - minimum distance of 8 units
            let distanceFromCenter = Math.sqrt(px * px + pz * pz);
            if (distanceFromCenter < 8) {
                attempts++;
                continue; // Skip this position, too close to generator
            }
            
            let propInstance = singleTreeMesh.createInstance("tree_center_" + treesPlaced);
            let size = 0.15;
            propInstance.scaling = new BABYLON.Vector3(size, size, size);
            propInstance.position = new BABYLON.Vector3(px, -0.5, pz);
            propInstance.rotation = new BABYLON.Vector3(0, Math.random() * Math.PI * 2, 0);
            propInstance.checkCollisions = false;
            propInstance.freezeWorldMatrix();
            
            treesPlaced++;
            attempts++;
        }
    });

    // ===== BUSH SYSTEM (Reliable approach — no MergeMeshes needed!) =====
    BABYLON.SceneLoader.ImportMesh("", "./", "bush.glb", scene, (meshes) => {
        let bushRoot = meshes[0];

        // Hide the original bush model underground
        bushRoot.position = new BABYLON.Vector3(0, -9000, 0);
        bushRoot.scaling = new BABYLON.Vector3(1, 1, 1);
        bushRoot.isVisible = false;
        bushRoot.getChildMeshes().forEach(m => {
            m.isVisible = false;
            m.checkCollisions = false;
        });

        let bushIdx = 0;

        function spawnBush(x, z, scale) {
            let b = bushRoot.clone("bush_" + bushIdx++);
            b.position = new BABYLON.Vector3(x, -0.3, z);
            b.scaling = new BABYLON.Vector3(scale, scale, scale);
            b.rotation = new BABYLON.Vector3(0, Math.random() * Math.PI * 2, 0);
            b.getChildMeshes().forEach(m => {
                m.isVisible = true;
                m.checkCollisions = false;
            });
            b.freezeWorldMatrix();
        }

        // --- GROUP 1: Bushes around the small town / forest area ---
        for (let i = 0; i < 35; i++) {
            let bx = townCenterX - 140 + Math.random() * 280;
            let bz = townCenterZ - 140 + Math.random() * 280;
            spawnBush(bx, bz, 5 + Math.random() * 4); // Big bushes!
        }

        // --- GROUP 2: Bushes near and around the launchpad ---
        for (let i = 0; i < 25; i++) {
            let bx = -750 + Math.random() * 200;
            let bz = -250 + Math.random() * 200;
            spawnBush(bx, bz, 6 + Math.random() * 5); // Even bigger near launchpad
        }

        // --- GROUP 3: Scattered bushes in the middle wasteland ---
        for (let i = 0; i < 20; i++) {
            let bx = -400 + Math.random() * 450;
            let bz = -300 + Math.random() * 600;
            spawnBush(bx, bz, 4 + Math.random() * 4);
        }
    });
    // ===== FOREST 2 SYSTEM (FAR LEFT CORNER - MOVED TO RED X) =====
    BABYLON.SceneLoader.ImportMesh("", "./", "forest 2.glb", scene, (meshes) => {
        let forest2Root = meshes[0];

        // Create a parent TransformNode so position actually works
        // (GLB root nodes sometimes have baked transforms that fight with .position)
        let forest2Parent = new BABYLON.TransformNode("forest2Parent", scene);

        // 🔥 THE FIX: Relocated precisely to the Red 'X' near the launchpad
        // Adjusted X and Z to push it further left and down without crashing
        forest2Parent.position = new BABYLON.Vector3(-600, -1.5, 170);

        forest2Parent.scaling = new BABYLON.Vector3(25, 25, 25);
        forest2Parent.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);

        // Re-parent the GLB root under our TransformNode
        forest2Root.parent = forest2Parent;
        forest2Root.position = BABYLON.Vector3.Zero();
        forest2Root.rotation = BABYLON.Vector3.Zero();
        forest2Root.scaling = BABYLON.Vector3.One();

        // Per-mesh invisible proxy colliders for solid, snag-free movement.
        meshes.forEach(mesh => {
            if (!(mesh instanceof BABYLON.Mesh) || mesh.getTotalVertices() < 40) {
                mesh.checkCollisions = false;
                return;
            }

            // Disable visual mesh collision
            mesh.checkCollisions = false;
            mesh.isPickable = false;

            // Create a tight, convex bounding-box collider
            mesh.computeWorldMatrix(true);
            let bbox = mesh.getBoundingInfo().boundingBox;
            let proxy = BABYLON.MeshBuilder.CreateBox("collider", {
                width: bbox.extendSize.x * 2 * 0.9,
                height: bbox.extendSize.y * 2 * 0.9,
                depth: bbox.extendSize.z * 2 * 0.9
            }, scene);

            proxy.position = bbox.centerWorld;
            proxy.isVisible = false;
            proxy.checkCollisions = true;
            proxy.isPickable = false;
        });
    });

    // ===== GLB GENERATOR MODEL (from generator.glb) =====
    BABYLON.SceneLoader.ImportMesh("", "./", "generator.glb", scene, (meshes) => {
        if (meshes.length > 0) {
            console.log("Generator GLB loaded successfully!", meshes);
            let generatorRoot = meshes[0];

            let generatorParent = new BABYLON.TransformNode("generatorParent", scene);
            // Adjusted Y position to 1.0 (definitely above ground) and X to -630 (further left)
            generatorParent.position = new BABYLON.Vector3(-600, 50, 365);
            // Increased scaling for visibility
            generatorParent.scaling = new BABYLON.Vector3(50, 50, 50);
            generatorParent.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);

            generatorRoot.parent = generatorParent;
            generatorRoot.position = BABYLON.Vector3.Zero();
            generatorRoot.rotation = BABYLON.Vector3.Zero();
            generatorRoot.scaling = BABYLON.Vector3.One();

            // Enable collisions for all meshes within the generator model
            meshes.forEach(mesh => {
                if (mesh instanceof BABYLON.Mesh) {
                    mesh.checkCollisions = true;
                    mesh.isPickable = false;
                }
            });
        } else {
            console.error("Generator.glb loaded no meshes. Check file path and content.");
        }
    });

    // ===== CENTRAL PROCEDURAL GENERATOR (NEWLY ADDED) =====
    // This is the generator block you remembered, placed at the map's center.
    var centralGenerator = BABYLON.MeshBuilder.CreateCylinder("centralGenerator", { diameter: 16, height: 25, tessellation: 24 }, scene);
    centralGenerator.position = new BABYLON.Vector3(0, 12.5 - 0.5, 0); // Centered at 0,0, lifted to ground level
    centralGenerator.material = topWallMat; // Using an existing material for visibility
    centralGenerator.checkCollisions = true;
    centralGenerator.isPickable = false;
    centralGenerator.freezeWorldMatrix();

    // ===== GAS STATION MODEL =====
BABYLON.SceneLoader.ImportMesh("", "./", "gas station.glb", scene, (meshes) => {
    if (meshes.length > 0) {
        console.log("Gas Station GLB loaded successfully!", meshes);
        let gasStationRoot = meshes[0];
        let gasStationParent = new BABYLON.TransformNode("gasStationParent", scene);
        // Fixed: Raised Y position so it sits properly on the ground
        gasStationParent.position = new BABYLON.Vector3(-100, 0, 650);
        gasStationParent.scaling = new BABYLON.Vector3(15, 15, 15);
        gasStationParent.rotation = new BABYLON.Vector3(0, 0, 0);
        gasStationRoot.parent = gasStationParent;
        gasStationRoot.position = BABYLON.Vector3.Zero();
        gasStationRoot.rotation = BABYLON.Vector3.Zero();
        gasStationRoot.scaling = BABYLON.Vector3.One();
        // Enable collisions for all meshes within the gas station model
        meshes.forEach(mesh => {
            if (mesh instanceof BABYLON.Mesh) {
                mesh.checkCollisions = true;
                mesh.isPickable = false;
            }
        });
    } else {
        console.error("Gas station.glb loaded no meshes. Check file path and content.");
    }
});

    var blinkingLights = [];

    // --- BUILDINGS PLACEMENT (Right Side = Cramped City) ---
    for (let x = -numBlocks; x < numBlocks; x++) {
        for (let z = -numBlocks; z < numBlocks; z++) {
            let cx = (x * spacing) + (spacing / 2);
            let cz = (z * spacing) + (spacing / 2);

            // ===== RIGHT SIDE: CRAMPED BUILDINGS (x > 0) =====
            if (cx > 0) {
                let actualCx = cx + 300; // Shift buildings significantly further away!
                let blockSize = spacing - 2;

                // ===== ATC RADAR TOWER IN THE CENTER =====
                if (x === 2 && z === 0) {
                    let towerWidth = 35;
                    let towerHeight = 420; // The tallest structure

                    // Main pillar (thin and tall)
                    createBuilding("atc_main", actualCx, cz, towerWidth, towerHeight, towerWidth, aiBuildingMat);

                    // Radar Ring / Control Cabin (wider box pushing out at the top)
                    let cabin = BABYLON.MeshBuilder.CreateBox("atc_cabin", { width: 55, height: 25, depth: 55 }, scene);
                    cabin.position = new BABYLON.Vector3(actualCx, towerHeight + 12.5, cz);
                    cabin.material = topWallMat;
                    cabin.checkCollisions = true;

                    // Thin up-reaching Antenna
                    let antenna = BABYLON.MeshBuilder.CreateCylinder("atc_antenna", { diameter: 4, height: 70 }, scene);
                    antenna.position = new BABYLON.Vector3(actualCx, towerHeight + 25 + 35, cz);
                    antenna.material = wall2Mat;

                    // Blinking Red Light on the Absolute Peak
                    let lightBox = BABYLON.MeshBuilder.CreateBox("atc_redLight", { size: 4 }, scene);
                    lightBox.position = new BABYLON.Vector3(actualCx, towerHeight + 25 + 70 + 2.5, cz);
                    let lightMat = new BABYLON.StandardMaterial("atc_redGlowMat", scene);
                    lightBox.material = lightMat;

                    blinkingLights.push(lightBox);

                    continue; // Skip the tiny sub-grid blocks perfectly for this spot alone!
                }

                // 3x3 sub-grid — tightly packed cramped buildings
                let subGridCount = 3;
                let subSpacing = blockSize / subGridCount;
                let uniformSize = subSpacing - 4; // tightly joined size

                for (let sx = 0; sx < subGridCount; sx++) {
                    for (let sz = 0; sz < subGridCount; sz++) {
                        if (Math.random() > 0.90) continue; // skip only ~10% for extremely dense look

                        let bWidth = uniformSize;
                        let bDepth = uniformSize;
                        // Tall uneven heights
                        let heightRoll = Math.random();
                        let bHeight;
                        if (heightRoll < 0.2) bHeight = 80 + Math.random() * 40;
                        else if (heightRoll < 0.5) bHeight = 130 + Math.random() * 60;
                        else if (heightRoll < 0.8) bHeight = 200 + Math.random() * 80;
                        else bHeight = 290 + Math.random() * 60;

                        let bx = actualCx - (blockSize / 2) + (sx * subSpacing) + (subSpacing / 2);
                        let bz = cz - (blockSize / 2) + (sz * subSpacing) + (subSpacing / 2);

                        createBuilding("bDense_" + x + z + sx + sz, bx, bz, bWidth, bHeight, bDepth, aiBuildingMat);
                    }
                }
            }
            // ===== LEFT SIDE: FOREST & TOWN → NO GRID BLOCKS =====
            else {
                continue;
            }
        }
    }

    // ===== BOTTOM LEFT: SMALL JOINED TOWN (Max 10 buildings, close together inside forest) =====
    // Small road intersections are handled above

    // 10 buildings placed cleanly around the crossroad (dynamically sized)
    const townSpots = [
        { bx: townCenterX - 22, bz: townCenterZ + 28 }, { bx: townCenterX + 22, bz: townCenterZ + 28 }, { bx: townCenterX - 22, bz: townCenterZ - 28 }, { bx: townCenterX + 22, bz: townCenterZ - 28 }, // 4 inner corners
        { bx: townCenterX - 45, bz: townCenterZ + 20 }, { bx: townCenterX + 45, bz: townCenterZ + 20 }, { bx: townCenterX - 45, bz: townCenterZ - 20 }, { bx: townCenterX + 45, bz: townCenterZ - 20 }, // 4 outer wings
        { bx: townCenterX, bz: townCenterZ + 55 }, { bx: townCenterX, bz: townCenterZ - 55 }                                         // 2 end caps
    ];

    townSpots.forEach((spot, index) => {
        let isTall = (index === 8 || index === 9); // Designate the two end caps as tall tower buildings!

        let bHeight = isTall ? (180 + Math.random() * 40) : (60 + Math.random() * 25);
        let bSizeX = isTall ? 22 : (14 + Math.random() * 6);
        let bSizeZ = isTall ? 22 : (14 + Math.random() * 6);

        createBuilding("bTown_" + index, spot.bx, spot.bz, bSizeX, bHeight, bSizeZ, wall2Mat);

        // Add Tower Structure and blinking red light!
        if (isTall) {
            // Smaller tower-like structure on top
            let towerHeight = 45;
            let tower = BABYLON.MeshBuilder.CreateBox("tower_" + index, { width: 6, height: towerHeight, depth: 6 }, scene);
            tower.position = new BABYLON.Vector3(spot.bx, bHeight + (towerHeight / 2), spot.bz);
            tower.material = wall2Mat;
            tower.freezeWorldMatrix();

            // Blinking Red Light Box right on the tip
            let lightBox = BABYLON.MeshBuilder.CreateBox("redLight_" + index, { size: 3 }, scene);
            lightBox.position = new BABYLON.Vector3(spot.bx, bHeight + towerHeight + 1.5, spot.bz);
            let lightMat = new BABYLON.StandardMaterial("redGlowMat_" + index, scene);
            lightBox.material = lightMat;

            blinkingLights.push(lightBox);
        }
    });

    // SINGLE GLOBAL OBSERVER FOR ALL BLINKING LIGHTS
    scene.onBeforeRenderObservable.add(() => {
        let time = performance.now();
        let isOn = (time % 1500 < 750);
        blinkingLights.forEach(box => {
            if (box.material) box.material.emissiveColor = isOn ? new BABYLON.Color3(1, 0, 0) : new BABYLON.Color3(0, 0, 0);
            box.isVisible = isOn;
        });
    });

    // ===== LAUNCHPAD MODEL (placed near the small town) =====
    BABYLON.SceneLoader.ImportMesh("", "./", "launchpad.glb", scene, (meshes) => {
        let launchpad = meshes[0];
        launchpad.position = new BABYLON.Vector3(-700, -0.5, -150);
        launchpad.scaling = new BABYLON.Vector3(5, 5, 5);
        launchpad.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);

        meshes.forEach(mesh => { mesh.checkCollisions = false; }); // Complex geometry trapping disabled!

        // ROCK SOLID MATH HITBOX (Wider, thicker, totally encases any jagged physics of the mesh!)
        let lBox = BABYLON.MeshBuilder.CreateBox("climbable", { width: 55, height: 26, depth: 55 }, scene);
        lBox.position = new BABYLON.Vector3(-700, 12, -150);
        lBox.isVisible = false;      // Hide the ugly block so only the GLB is shown
        lBox.checkCollisions = true; // Massive physical climbable wall block
    });

    // ===== ROCKET MODEL =====
    BABYLON.SceneLoader.ImportMesh("", "./", "rocket.glb", scene, (meshes) => {
        let rocket = meshes[0];
        rocket.position = new BABYLON.Vector3(-700, -0.5, -150);
        rocket.scaling = new BABYLON.Vector3(5, 5, 5); // Match launchpad scale
        rocket.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0); // Rotate perfectly with launchpad

        meshes.forEach(mesh => { mesh.checkCollisions = false; }); // Complex geometry trapping disabled!

        // ROCK SOLID MATH HITBOX (Thicker cylinder ensures absolute solid bounding collision)
        let rBox = BABYLON.MeshBuilder.CreateCylinder("climbable", { diameter: 22, height: 150 }, scene);
        rBox.position = new BABYLON.Vector3(-700, 75, -150);
        rBox.isVisible = false;
        rBox.checkCollisions = true; // Solid absolute cylinder the player can vertically climb
    });
    // ===== PLAYER SETUP ===== (everything below is 100% your original code, unchanged)
    var playerBox = BABYLON.MeshBuilder.CreateBox("playerBox", { size: 2 }, scene);
    playerBox.position = new BABYLON.Vector3(-650, 2, -300); // Spawns directly inside the relocated far-left town!
    playerBox.isVisible = false;
    playerBox.checkCollisions = true;
    playerBox.ellipsoid = new BABYLON.Vector3(0.5, 1.0, 0.5);
    playerBox.ellipsoidOffset = new BABYLON.Vector3(0, 0.2, 0); // Lifts collision center to glide over small bumps
    playerBox.alwaysSelectAsActiveMesh = true;
    playerBox.refreshBoundingInfo(true);

    // ===== CAMERA TARGET (separate vector we lerp smoothly) =====
    var cameraTargetPos = playerBox.position.clone();
    cameraTargetPos.y += 3.5;

    var camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 18, cameraTargetPos, scene);
    camera.attachControl(canvas, true);
    // Do NOT use lockedTarget — we manually lerp the target for smoothness

    camera.minZ = 0.5;
    camera.maxZ = 6000;
    camera.lowerRadiusLimit = 6;
    camera.wheelPrecision = 0.5;       // Decreased to zoom faster
    camera.wheelDeltaPercentage = 0.06; // Increased to zoom faster

    // Mouse rotation smoothness
    camera.angularSensibilityX = 600;
    camera.angularSensibilityY = 600;
    camera.inertia = 0.9;         // Increased from 0.75 for smoother camera gliding
    camera.panningInertia = 0.9;
    camera.speed = 1.5;

    // Clamp vertical angle so camera doesn't go underground
    camera.lowerBetaLimit = 0.15;
    camera.upperBetaLimit = Math.PI * 0.85;

    // Camera follow smoothing factor (higher = snappier, lower = smoother glide)
    var cameraFollowSpeed = 0.15; // Set to 0.15 for a smoother, less laggy feel

    // Click canvas to hide cursor and enable mouselook
    scene.onPointerDown = function (evt) {
        if (!engine.isPointerLock) {
            engine.enterPointerlock();
        }
        if (evt.button === 2) {
            keys["rightClick"] = true;
        }
    };

    scene.onPointerUp = function (evt) {
        if (evt.button === 2) {
            keys["rightClick"] = false;
        }
    };
    canvas.oncontextmenu = (e) => e.preventDefault();



    // ===== LIGHTNING & THUNDER SYSTEM =====
    var nextLightningTime = performance.now() + (Math.random() * 5000 + 4000);
    var isLightningActive = false;
    var lightningDecay = 0;

    scene.onBeforeRenderObservable.add(() => {
        let now = performance.now();
        if (now > nextLightningTime && !isLightningActive) {
            isLightningActive = true;
            lightningDecay = 1.0;
            // Schedule next lightning strike wildly between 3 and 10 seconds
            nextLightningTime = now + (Math.random() * 7000 + 3000);

            // Quick random double-flash for realism
            if (Math.random() > 0.6) {
                setTimeout(() => { lightningDecay = 0.8; }, 150 + Math.random() * 100);
            }
        }

        if (isLightningActive) {
            // Decay based on hardware fps
            lightningDecay -= 0.05 * (scene.getEngine().getDeltaTime() / 16.6);
            if (lightningDecay <= 0) {
                lightningDecay = 0;
                isLightningActive = false;
            }

            let flashAmt = Math.max(0, lightningDecay);
            // Flash the background apocalyptic sky white/blue
            let baseColor = new BABYLON.Color3(0.12, 0.14, 0.16);
            let flashColor = new BABYLON.Color3(0.85, 0.9, 1.0);
            scene.clearColor = BABYLON.Color3.Lerp(baseColor, flashColor, flashAmt);

            // Flash the global sun intensity brightly
            light.intensity = 0.65 + (flashAmt * 2.0);
        }
    });
var idleModel, walkModel, runModel, jumpModel, climbModel, dieModel, runJumpModel, freefallModel, crouchModel, attackModel, interactModel;
var jumpAnimGroup = null, dieAnimGroup = null, runJumpAnimGroup = null, freefallAnimGroup = null;
var idleAnimGroup = null, walkAnimGroup = null, runAnimGroup = null, climbAnimGroup = null, crouchAnimGroup = null, attackAnimGroup = null, interactAnimGroup = null;

    function align(m) {
        m.scaling.scaleInPlace(0.13);
        m.position = new BABYLON.Vector3(0, 3.15, 0); // Raised slightly so feet don't clip into the ground
        m.parent = playerBox;
        m.setEnabled(false);
        m.alwaysSelectAsActiveMesh = true;
        m.refreshBoundingInfo(true);
    }

    // ===== PLAYER ANIMATIONS ===== (unchanged)
    BABYLON.SceneLoader.ImportMesh("", "./", "r1_idol.glb", scene, (m, p, s, anim) => {
        idleModel = m[0]; align(idleModel);
        m.forEach(mesh => { mesh.alwaysSelectAsActiveMesh = true; mesh.refreshBoundingInfo(true); });
        if (anim && anim.length > 0) { idleAnimGroup = anim[0]; idleAnimGroup.enableBlending = true; idleAnimGroup.blendingSpeed = 0.08; idleAnimGroup.speedRatio = 1.0; idleAnimGroup.play(true); }
    });

    BABYLON.SceneLoader.ImportMesh("", "./", "r1_walk.glb", scene, (m, p, s, anim) => {
        walkModel = m[0]; align(walkModel);
        m.forEach(mesh => { mesh.alwaysSelectAsActiveMesh = true; mesh.refreshBoundingInfo(true); });
        if (anim && anim.length > 0) { walkAnimGroup = anim[0]; walkAnimGroup.enableBlending = true; walkAnimGroup.blendingSpeed = 0.08; walkAnimGroup.speedRatio = 0.85; walkAnimGroup.play(true); }
    });

    BABYLON.SceneLoader.ImportMesh("", "./", "r1_run.glb", scene, (m, p, s, anim) => {
        runModel = m[0]; align(runModel);
        m.forEach(mesh => { mesh.alwaysSelectAsActiveMesh = true; mesh.refreshBoundingInfo(true); });
        if (anim && anim.length > 0) { runAnimGroup = anim[0]; runAnimGroup.enableBlending = true; runAnimGroup.blendingSpeed = 0.08; runAnimGroup.speedRatio = 1.0; runAnimGroup.play(true); }
    });

    BABYLON.SceneLoader.ImportMesh("", "./", "r1_crouch.glb", scene, (m, p, s, anim) => {
        crouchModel = m[0]; align(crouchModel);
        m.forEach(mesh => { mesh.alwaysSelectAsActiveMesh = true; mesh.refreshBoundingInfo(true); });
        if (anim && anim.length > 0) { crouchAnimGroup = anim[0]; crouchAnimGroup.enableBlending = true; crouchAnimGroup.blendingSpeed = 0.08; crouchAnimGroup.speedRatio = 0.5; crouchAnimGroup.play(true); }
    });

    BABYLON.SceneLoader.ImportMesh("", "./", "r1_freefall.glb", scene, (m, p, s, anim) => {
        freefallModel = m[0]; align(freefallModel);
        m.forEach(mesh => { mesh.alwaysSelectAsActiveMesh = true; mesh.refreshBoundingInfo(true); });
        if (anim && anim.length > 0) {
            freefallAnimGroup = anim[0];
            freefallAnimGroup.enableBlending = true;
            freefallAnimGroup.play(true);
        }
    });

    BABYLON.SceneLoader.ImportMesh("", "./", "r1_jump.glb", scene, (m, p, s, anim) => {
        jumpModel = m[0]; align(jumpModel);
        m.forEach(mesh => { mesh.alwaysSelectAsActiveMesh = true; mesh.refreshBoundingInfo(true); });
        if (anim && anim.length > 0) {
            jumpAnimGroup = anim[0];
            jumpAnimGroup.enableBlending = true;
            jumpAnimGroup.stop();
        }
    });

    BABYLON.SceneLoader.ImportMesh("", "./", "r1_runningjump.glb", scene, (m, p, s, anim) => {
        runJumpModel = m[0]; align(runJumpModel);
        m.forEach(mesh => { mesh.alwaysSelectAsActiveMesh = true; mesh.refreshBoundingInfo(true); });
        if (anim && anim.length > 0) {
            runJumpAnimGroup = anim;
            anim.forEach(a => {
                a.enableBlending = true;
                a.stop();
            });
        }
    });

    BABYLON.SceneLoader.ImportMesh("", "./", "r1_die.glb", scene, (m, p, s, anim) => {
        dieModel = m[0]; align(dieModel);
        m.forEach(mesh => { mesh.alwaysSelectAsActiveMesh = true; mesh.refreshBoundingInfo(true); });
        if (anim && anim.length > 0) {
            dieAnimGroup = anim[0];
            dieAnimGroup.loopAnimation = false;
            dieAnimGroup.stop();
        }
    });

    BABYLON.SceneLoader.ImportMesh("", "./", "r1_wall_climbing.glb", scene, (m, p, s, anim) => {
        climbModel = m[0];
        climbModel.normalizeToUnitCube();
        climbModel.scaling = new BABYLON.Vector3(4.6, 4.6, 4.6);
        climbModel.position = new BABYLON.Vector3(0, 2.4, -1.0);
        climbModel.rotation = new BABYLON.Vector3(0, 0, 0);
        climbModel.parent = playerBox;
        m.forEach(mesh => { mesh.alwaysSelectAsActiveMesh = true; mesh.refreshBoundingInfo(true); });
        if (anim && anim.length > 0) { climbAnimGroup = anim[0]; climbAnimGroup.enableBlending = true; climbAnimGroup.speedRatio = 1.2; climbAnimGroup.play(true); }
        climbModel.setEnabled(false);
    });

BABYLON.SceneLoader.ImportMesh("", "./", "r1_punch.glb", scene, (m, p, s, anim) => {
         attackModel = m[0]; align(attackModel);
         m.forEach(mesh => { mesh.alwaysSelectAsActiveMesh = true; mesh.refreshBoundingInfo(true); });
         if (anim && anim.length > 0) {
             attackAnimGroup = anim; // Store all tracks correctly as an array
             anim.forEach(a => {
                 a.enableBlending = false; // Disable blending so the punch doesn't feel restrained!
                 a.stop();
             });
         }
     });

     // ===== INTERACTION ANIMATION (V key) =====
     BABYLON.SceneLoader.ImportMesh("", "./", "r1_interact.glb", scene, (m, p, s, anim) => {
         interactModel = m[0]; align(interactModel);
         m.forEach(mesh => { mesh.alwaysSelectAsActiveMesh = true; mesh.refreshBoundingInfo(true); });
         if (anim && anim.length > 0) {
             interactAnimGroup = anim[0];
             interactAnimGroup.enableBlending = true;
             interactAnimGroup.blendingSpeed = 0.08;
             interactAnimGroup.speedRatio = 1.0;
             interactAnimGroup.stop(); // start stopped, we'll play on key press
             interactAnimGroup.onAnimationEndObservable.add(() => {
                 isInteracting = false;
                 if (interactModel) interactModel.setEnabled(false);
             });
         }
     });

    // ===== SKINNER ZOMBIES =====
    // ===== SKINNER ZOMBIES (OPTIMIZED: LOAD ONCE, CLONE MANY) =====
    var skinners = [];
    var spawnPoints = [
        new BABYLON.Vector3(350, 2, 80), new BABYLON.Vector3(400, 2, -150), new BABYLON.Vector3(500, 2, 240),
        new BABYLON.Vector3(330, 2, -300), new BABYLON.Vector3(430, 2, 400), new BABYLON.Vector3(470, 2, 10),
        new BABYLON.Vector3(370, 2, -50), new BABYLON.Vector3(550, 2, -220), new BABYLON.Vector3(600, 2, 120),
        new BABYLON.Vector3(530, 2, 350), new BABYLON.Vector3(390, 2, 280), new BABYLON.Vector3(440, 2, -320),
        new BABYLON.Vector3(460, 2, -70), new BABYLON.Vector3(310, 2, 180), new BABYLON.Vector3(630, 2, -20),
        new BABYLON.Vector3(340, 2, 150), new BABYLON.Vector3(480, 2, -180), new BABYLON.Vector3(650, 2, 200),
        new BABYLON.Vector3(700, 2, -50), new BABYLON.Vector3(520, 2, 0)
    ];

    // 1. LOAD THE FILES EXACTLY ONCE INTO CONTAINERS
    Promise.all([
        BABYLON.SceneLoader.LoadAssetContainerAsync("./", "skinner walking.glb", scene),
        BABYLON.SceneLoader.LoadAssetContainerAsync("./", "skinner running.glb", scene),
        BABYLON.SceneLoader.LoadAssetContainerAsync("./", "skinner biting.glb", scene),
        BABYLON.SceneLoader.LoadAssetContainerAsync("./", "skinner climb.glb", scene)
    ]).then((containers) => {
        let walkContainer = containers[0];
        let runContainer = containers[1];
        let biteContainer = containers[2];
        let climbContainer = containers[3];

        // 2. SPAWN FUNCTION THAT INSTANTLY CLONES FROM THE CONTAINERS
        function spawnSkinner(pos) {
            let sBox = BABYLON.MeshBuilder.CreateBox("sBox", { size: 2 }, scene);
            sBox.position = pos;
            sBox.isVisible = false;
            sBox.checkCollisions = true;
            sBox.ellipsoid = new BABYLON.Vector3(0.5, 1.0, 0.5);
            sBox.alwaysSelectAsActiveMesh = true;
            sBox.refreshBoundingInfo(true);

            let skinner = {
                box: sBox, models: {}, anims: {},
                wanderAngle: Math.random() * Math.PI * 2,
                turnTimer: 100, isClimbingState: false, yVel: 0, forwardBoost: 0
            };

            function alignSkinner(m, isClimbModel = false) {
                m.scaling.scaleInPlace(0.13);
                m.parent = sBox;
                m.setEnabled(false);
                m.alwaysSelectAsActiveMesh = true;
                m.refreshBoundingInfo(true);

                if (isClimbModel) {
                    m.rotation = new BABYLON.Vector3(Math.PI / 2, Math.PI, 0);
                    m.position = new BABYLON.Vector3(0, 3.5, -1.5);
                } else {
                    m.position = new BABYLON.Vector3(0, 3.7, 0);
                    m.rotation = new BABYLON.Vector3(0, 0, 0);
                }
            }

            // INSTANTLY CLONE WALKING
            let walkInst = walkContainer.instantiateModelsToScene();
            skinner.models.walk = walkInst.rootNodes[0];
            alignSkinner(skinner.models.walk);
            if (walkInst.animationGroups.length > 0) {
                skinner.anims.walk = walkInst.animationGroups[0];
                skinner.anims.walk.enableBlending = true;
                skinner.anims.walk.play(true);
            }
            skinner.models.walk.setEnabled(true);

            // INSTANTLY CLONE RUNNING
            let runInst = runContainer.instantiateModelsToScene();
            skinner.models.run = runInst.rootNodes[0];
            alignSkinner(skinner.models.run);
            // 🔄 HOTFIX: Rotate the running model 180 degrees so they don't sprint backwards!
            skinner.models.run.rotation.y = Math.PI;

            if (runInst.animationGroups.length > 0) {
                skinner.anims.run = runInst.animationGroups[0];
                skinner.anims.run.enableBlending = true;
                skinner.anims.run.play(true);
            }

            // INSTANTLY CLONE BITING
            let biteInst = biteContainer.instantiateModelsToScene();
            skinner.models.bite = biteInst.rootNodes[0];
            alignSkinner(skinner.models.bite);
            if (biteInst.animationGroups.length > 0) {
                skinner.anims.bite = biteInst.animationGroups[0];
                skinner.anims.bite.enableBlending = true;
                skinner.anims.bite.play(true);
            }

            // INSTANTLY CLONE CLIMBING
            let climbInst = climbContainer.instantiateModelsToScene();
            skinner.models.climb = climbInst.rootNodes[0];
            alignSkinner(skinner.models.climb, true);
            climbInst.rootNodes[0].getChildMeshes().forEach(mesh => {
                mesh.alwaysSelectAsActiveMesh = true;
                mesh.refreshBoundingInfo(true);
            });
            if (climbInst.animationGroups.length > 0) {
                skinner.anims.climb = climbInst.animationGroups[0];
                skinner.anims.climb.enableBlending = true;
                skinner.anims.climb.play(true);
            }

            skinners.push(skinner);
        }

        // 3. NOW SPAWN ALL 20 ZOMIES INSTANTLY
        spawnPoints.forEach(pos => spawnSkinner(pos));
    });

    // ===== BASIC GROUND ZOMBIES =====
    // ===== BASIC GROUND ZOMBIES (OPTIMIZED: LOAD ONCE, CLONE MANY) =====
    var basicZombies = [];
    var basicSpawnPoints = [
        new BABYLON.Vector3(-180, 2, 80), new BABYLON.Vector3(-250, 2, -80),
        new BABYLON.Vector3(-320, 2, 30), new BABYLON.Vector3(-290, 2, -180),
        new BABYLON.Vector3(-190, 2, 100), new BABYLON.Vector3(-260, 2, -200),
        new BABYLON.Vector3(-330, 2, -120), new BABYLON.Vector3(-160, 2, -260)
    ];

    // 1. Load the eating and walking files exactly ONCE
    Promise.all([
        BABYLON.SceneLoader.LoadAssetContainerAsync("./", "zombie1_eating.glb", scene),
        BABYLON.SceneLoader.LoadAssetContainerAsync("./", "zombie1_walk.glb", scene)
    ]).then((containers) => {
        let eatContainer = containers[0];
        let walkContainer = containers[1];

        // 2. Spawn function that instantly stamps out clones
        function spawnBasicZombie(pos) {
            let bBox = BABYLON.MeshBuilder.CreateBox("basicBox", { size: 2 }, scene);
            bBox.position = pos;
            bBox.isVisible = false;
            bBox.checkCollisions = true;
            bBox.ellipsoid = new BABYLON.Vector3(0.5, 1.0, 0.5);
            bBox.alwaysSelectAsActiveMesh = true;
            bBox.refreshBoundingInfo(true);

            let basic = {
                box: bBox, eatModel: null, walkModel: null,
                isEating: true, chaseTimer: 0, health: 3, isDead: false
            };

            // INSTANTLY CLONE EATING
            let eatInst = eatContainer.instantiateModelsToScene();
            basic.eatModel = eatInst.rootNodes[0];
            basic.eatModel.scaling.scaleInPlace(0.10);
            basic.eatModel.rotation = new BABYLON.Vector3(-Math.PI / 2, Math.PI, 0);
            basic.eatModel.position = new BABYLON.Vector3(0, -0.2, 0);
            basic.eatModel.parent = bBox;
            basic.eatModel.alwaysSelectAsActiveMesh = true;
            basic.eatModel.refreshBoundingInfo(true);
            basic.eatModel.setEnabled(true);
            if (eatInst.animationGroups.length > 0) {
                eatInst.animationGroups[0].enableBlending = true;
                eatInst.animationGroups[0].play(true);
            }

            // INSTANTLY CLONE WALKING
            let walkInst = walkContainer.instantiateModelsToScene();
            basic.walkModel = walkInst.rootNodes[0];
            basic.walkModel.scaling.scaleInPlace(0.12);
            basic.walkModel.position = new BABYLON.Vector3(0, 2.2, 0);
            basic.walkModel.parent = bBox;
            basic.walkModel.alwaysSelectAsActiveMesh = true;
            basic.walkModel.refreshBoundingInfo(true);
            basic.walkModel.setEnabled(false);
            if (walkInst.animationGroups.length > 0) {
                walkInst.animationGroups[0].enableBlending = true;
                walkInst.animationGroups[0].play(true);
            }

            basicZombies.push(basic);
        }

        // 3. Spawn all basic zombies instantly
        basicSpawnPoints.forEach(pos => spawnBasicZombie(pos));
    });

    // ===== PHYSICS & CONTROLS ===== (everything below is your exact code)
    var keys = {};
    window.onkeydown = (e) => {
        let k = e.key.toLowerCase();
        keys[k] = true;
        if (e.key === " ") keys["space"] = true;
        if (k === "v" && !isInteracting && !isAttacking && grounded && !isClimbing) {
            isInteracting = true;
            if (interactAnimGroup) {
                interactAnimGroup.stop();
                interactAnimGroup.reset();
                interactAnimGroup.start(false, 1.0, interactAnimGroup.from, interactAnimGroup.to);
                if (interactModel) interactModel.setEnabled(true);
            }
        }
    };
    window.onkeyup = (e) => { keys[e.key.toLowerCase()] = false; if (e.key === " ") keys["space"] = false; };

    // Delta-time factor (base at 60fps = 16.67ms per frame)
    var TARGET_FPS = 60;
    var lastFrameTime = performance.now();

    var vVel = 0;
    var gravity = -0.09;
    var terminalVelocity = -2.8;

    // GTA-style smooth speed interpolation
    var currentMoveSpeed = 0;
    var grounded = false;

    var isClimbing = false;
    var isPullingUp = false;
    var pullUpTimer = 0;

var isDead = false;
var deathTimer = 0;
var isRunningJump = false;

var isAttacking = false;
var attackTimer = 0;
var isInteracting = false;

    function takeDamage(amount) {
        if (isDead) return;
        currentHealth -= amount;
        let healthPercent = Math.max(0, (currentHealth / maxHealth) * 100);
        healthBarInner.width = healthPercent + "%";

        if (currentHealth <= 30) healthBarInner.background = "#e74c3c";
        else if (currentHealth <= 60) healthBarInner.background = "#f1c40f";
        else healthBarInner.background = "#2ecc71";

        if (currentHealth <= 0) triggerDeath();
    }

    function triggerDeath() {
        if (!isDead) {
            isDead = true;
            deathTimer = 800;
            if (dieAnimGroup) {
                dieAnimGroup.stop();
                dieAnimGroup.reset();
                dieAnimGroup.start(false, 1.0, dieAnimGroup.from, dieAnimGroup.to);
            }
        }
    }

    scene.onBeforeRenderObservable.add(() => {
        // ===== DELTA TIME =====
        var now = performance.now();
        var rawDt = (now - lastFrameTime) / 1000; // seconds
        lastFrameTime = now;
        var dt = Math.min(rawDt, 0.05); // clamp to 50ms max to avoid spiral
        var dtFactor = dt * TARGET_FPS; // ~1.0 at 60fps, ~2.0 at 30fps, etc.
        // Attack timer countdown - must run every frame even when alive
        // Attack timer countdown (must run every frame)


        // ===== SMOOTH CAMERA FOLLOW =====
        var desiredTarget = playerBox.position.add(new BABYLON.Vector3(0, 3.5, 0));
        var lerpAmount = 1.0 - Math.pow(1.0 - cameraFollowSpeed, dtFactor);
        cameraTargetPos.x += (desiredTarget.x - cameraTargetPos.x) * lerpAmount;
        cameraTargetPos.y += (desiredTarget.y - cameraTargetPos.y) * lerpAmount;
        cameraTargetPos.z += (desiredTarget.z - cameraTargetPos.z) * lerpAmount;
        camera.target = cameraTargetPos;

        var camF = camera.getDirection(BABYLON.Vector3.Forward()); camF.y = 0; camF.normalize();
        var camR = camera.getDirection(BABYLON.Vector3.Right()); camR.y = 0; camR.normalize();

        var move = BABYLON.Vector3.Zero();
        var finalMove = BABYLON.Vector3.Zero();

        if (isDead) {



            deathTimer -= dtFactor;
            if (deathTimer <= 0) {
                isDead = false;
                currentHealth = maxHealth;
                healthBarInner.width = "100%";
                healthBarInner.background = "#2ecc71";
                playerBox.position = new BABYLON.Vector3(85, 420, 120);
                cameraTargetPos = playerBox.position.clone();
                cameraTargetPos.y += 3.5;
                vVel = 0;
            }
        }

        if (!isDead) {
            if (keys["rightClick"] && !isAttacking && grounded && !isClimbing) {
                isAttacking = true;
                attackTimer = 45; // Trimmed drastically to instantly return to idle
                keys["rightClick"] = false;

                // SHOOT RED FRISBEE PROJECTILE! (Delayed to powerfully sync with animation striking forward)
                let shootDir = playerBox.getDirection(BABYLON.Vector3.Forward()); // Capture direction strictly at click!
                let spawnOrigin = playerBox.position.clone();                     // Capture standing pos securely!

                setTimeout(() => {
                    // EXTREMELY OPTIMIZED STORAGE: Density dropped drastically to 8-sided geometry, size minimized!
                    let frisbee = BABYLON.MeshBuilder.CreateCylinder("frisbee", { diameter: 0.9, height: 0.08, tessellation: 8 }, scene);
                    frisbee.position = spawnOrigin;
                    frisbee.position.y += 0.8; // Throw from chest level

                    let fMat = new BABYLON.StandardMaterial("fMat", scene);
                    fMat.emissiveColor = new BABYLON.Color3(1, 0, 0); // Bright Red Glow
                    fMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
                    frisbee.material = fMat;

                    frisbee.rotation.x = Math.PI / 2; // Tilt it flat like a plate

                    let fLife = 120; // De-spawn timer
                    let fObserver = scene.onBeforeRenderObservable.add(() => {
                        let currentDt = (scene.getEngine().getDeltaTime() / 16.6) || 1.0;
                        frisbee.position.addInPlace(shootDir.scale(1.2 * currentDt)); // Travel speed cleanly without rotation!

                        // ZOMBIE HIT DETECTION
                        for (let z of basicZombies) {
                            if (!z.isDead && frisbee.intersectsMesh(z.box, false)) {
                                fLife = 0; // Destroy frisbee immediately
                                z.health -= 1;

                                // Push zombie backward cleanly on every hit!
                                z.box.moveWithCollisions(shootDir.scale(1.5));

                                if (z.health <= 0) {
                                    z.isDead = true;

                                    // GAS VANISHING EFFECT
                                    var smoke = new BABYLON.ParticleSystem("mist", 80, scene);
                                    smoke.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/flare.png", scene);
                                    smoke.emitter = z.box.position.clone();
                                    smoke.minEmitBox = new BABYLON.Vector3(-1.5, 0, -1.5);
                                    smoke.maxEmitBox = new BABYLON.Vector3(1.5, 2.5, 1.5);
                                    smoke.color1 = new BABYLON.Color4(0.2, 0.8, 0.3, 0.8); // Toxic bright green mist
                                    smoke.color2 = new BABYLON.Color4(0.0, 0.5, 0.1, 0.5); // Darker hanging gas
                                    smoke.colorDead = new BABYLON.Color4(0, 0.2, 0, 0.0);
                                    smoke.minSize = 4.0; smoke.maxSize = 7.0; // Large billowy clouds
                                    smoke.minLifeTime = 1.0; smoke.maxLifeTime = 2.0; // Hangs in the air longer
                                    smoke.emitRate = 200;
                                    smoke.gravity = new BABYLON.Vector3(0, 0.8, 0); // Slower rise
                                    smoke.targetStopDuration = 1.0; // Emits explicitly for a full second
                                    smoke.disposeOnStop = true;
                                    smoke.start();

                                    // Safely hide visual models completely
                                    if (z.walkModel) z.walkModel.setEnabled(false);
                                    if (z.eatModel) z.eatModel.setEnabled(false);
                                    z.box.position.y = -100; // Teleport the box away permanently so it ignores the player
                                }
                                break; // Only hit one zombie per plate chunk
                            }
                        }

                        fLife -= currentDt;
                        if (fLife <= 0) {
                            frisbee.dispose();
                            scene.onBeforeRenderObservable.remove(fObserver);
                        }
                    });
                }, 250); // Exact 250ms delay to make it fire dynamically exactly as the hand strikes forward!

                // Disable ALL other animations first
                if (idleModel) idleModel.setEnabled(false);
                if (walkModel) walkModel.setEnabled(false);
                if (runModel) runModel.setEnabled(false);
                if (jumpModel) jumpModel.setEnabled(false);
                if (runJumpModel) runJumpModel.setEnabled(false);
                if (freefallModel) freefallModel.setEnabled(false);
                if (climbModel) climbModel.setEnabled(false);
                if (crouchModel) crouchModel.setEnabled(false);
                if (attackModel) attackModel.setEnabled(true);
                if (attackAnimGroup) {
                    if (Array.isArray(attackAnimGroup)) {
                        attackAnimGroup.forEach(a => {
                            a.stop();
                            a.reset();
                            // Mathematical Trim: Slice off the last 45% of the animation so the fake "idle" tail is removed!
                            a.start(false, 1.3, a.from, a.from + (a.to - a.from) * 0.55);
                        });
                    } else {
                        attackAnimGroup.stop();
                        attackAnimGroup.reset();
                        attackAnimGroup.start(false, 1.3, attackAnimGroup.from, attackAnimGroup.from + (attackAnimGroup.to - attackAnimGroup.from) * 0.55);
                    }
                }
            }

            if (isAttacking) {
                attackTimer -= dtFactor;
                if (attackTimer <= 0) isAttacking = false;

                // ROOT CHARACTER IN PLACE: Stop completely while throwing frisbee punch
                currentMoveSpeed = 0;
                move = BABYLON.Vector3.Zero();
            } else {
                // NORMAL MOVEMENT (Only allowed if NOT attacking)
                if (keys["w"]) move.addInPlace(camF);
                if (keys["s"]) move.addInPlace(camF.scale(-1));
                if (keys["a"]) move.addInPlace(camR.scale(-1));
                if (keys["d"]) move.addInPlace(camR);
            }

            var forwardDir = playerBox.getDirection(BABYLON.Vector3.Forward());
            var isMoving = move.length() > 0;
            var isSSprint = keys["shift"];
            var isCrouching = keys["c"];

            // ===== MOVEMENT SPEEDS (matched to animation stride) =====
            var walkSpeed = 0.25;    // walk — grounded, feet match
            var runSpeed = 0.58;     // run — fast but animation matches
            var crouchSpeed = 0.06;  // crouch — careful and slow

            if (isPullingUp) {
                vVel = 0; // Stop any falling velocity while vaulting
                pullUpTimer += dtFactor;

                // Vault Action: A quick, powerful upward and forward movement
                    if (pullUpTimer < 15) { // Short duration for the vault action
                        // Combined upward and forward motion to quickly get onto the ledge
                        let vaultForce = 0.1 * dtFactor; // Reduced force to remove the "hop"
                        playerBox.moveWithCollisions(new BABYLON.Vector3(0, vaultForce, 0)); // Subtle upward boost
                        playerBox.moveWithCollisions(forwardDir.scale(vaultForce * 2.0)); // Forward push to clear the ledge
                    } else {
                    // Vault complete, reset state
                    isPullingUp = false;
                    // Ensure player is grounded after vaulting
                    grounded = true; // Assume player lands on the roof
                }
            } else {
                var wallRay = new BABYLON.Ray(playerBox.position, forwardDir, 1.2);
                var ledgeRay = new BABYLON.Ray(playerBox.position.add(new BABYLON.Vector3(0, 1.2, 0)), forwardDir, 1.2);

                var wallHit = scene.pickWithRay(wallRay, (m) => m.name === "climbable");
                var ledgeHit = scene.pickWithRay(ledgeRay, (m) => m.name === "climbable");

                if (wallHit.hit && keys["w"]) {
                    isClimbing = true;
                    if (!ledgeHit.hit) {
                        // Reach the top: stop climbing and transition directly to idle
                        isClimbing = false;
                        // Position player precisely on top of the ledge to avoid hop
                        playerBox.position.y = wallHit.pickedPoint.y + 1.0; // Adjust height as needed
                        grounded = true;
                        vVel = 0; // Cancel any vertical velocity
                        // Pulling up state not needed - go straight to idle
                    }
                } else {
                    isClimbing = false;
                }


                if (isClimbing) {
                    vVel = 0;
                    if (keys["w"]) finalMove.y = 0.15 * dtFactor;
                    if (keys["s"]) finalMove.y = -0.15 * dtFactor;
                    playerBox.rotation.y = Math.atan2(-wallHit.getNormal(true).x, -wallHit.getNormal(true).z);
                    // Scale climb animation to match climb speed
                    if (climbAnimGroup) climbAnimGroup.speedRatio = (keys["w"] || keys["s"]) ? 1.2 : 0.0;
                } else {
                    if (keys["space"] && grounded) {
                        grounded = false;
                        keys["space"] = false;
                        if (keys["w"] || keys["s"] || keys["a"] || keys["d"]) {
                            vVel = 2.8;
                            isRunningJump = true;
                            if (runJumpAnimGroup) {
                                if (Array.isArray(runJumpAnimGroup)) {
                                    runJumpAnimGroup.forEach(a => {
                                        a.stop();
                                        a.reset();
                                        a.start(false, 1.0, a.from, a.to);
                                    });
                                } else {
                                    runJumpAnimGroup.stop();
                                    runJumpAnimGroup.reset();
                                    runJumpAnimGroup.start(false, 1.0, runJumpAnimGroup.from, runJumpAnimGroup.to);
                                }
                            }
                        } else {
                            vVel = 2.2;
                            isRunningJump = false;
                            if (jumpAnimGroup) {
                                jumpAnimGroup.stop();
                                jumpAnimGroup.reset();
                                jumpAnimGroup.start(false, 1.0, jumpAnimGroup.from, jumpAnimGroup.to);
                            }
                        }
                    }

                    vVel += gravity * dtFactor;
                    if (vVel < terminalVelocity) vVel = terminalVelocity;

                    var targetSpeed = isCrouching ? crouchSpeed : (isSSprint ? runSpeed : walkSpeed);

                    // GTA-style smooth acceleration / deceleration
                    if (isMoving) {
                        var accelRate = 0.15; // faster ramp-up for responsive feel
                        currentMoveSpeed += (targetSpeed - currentMoveSpeed) * (1.0 - Math.pow(1.0 - accelRate, dtFactor));
                        finalMove = move.normalize().scale(currentMoveSpeed * dtFactor);
                    } else {
                        // Decelerate smoothly to stop
                        currentMoveSpeed *= Math.pow(0.85, dtFactor);
                        if (currentMoveSpeed < 0.005) currentMoveSpeed = 0;
                        finalMove = BABYLON.Vector3.Zero();
                    }
                    finalMove.y = vVel;

                    // ===== DYNAMIC ANIMATION SPEED RATIO (scales with actual movement) =====
                    if (isMoving && grounded) {
                        // Dynamically match animation speed to actual movement speed
                        var speedRatioFactor = currentMoveSpeed / targetSpeed;
                        if (isSSprint && runAnimGroup) {
                            runAnimGroup.speedRatio = 0.6 + speedRatioFactor * 0.3;  // 0.6-0.9 range (slower anim to match fast movement)
                        } else if (walkAnimGroup) {
                            walkAnimGroup.speedRatio = 0.5 + speedRatioFactor * 0.35; // 0.5-0.85 range
                        }
                        if (isCrouching && crouchAnimGroup) {
                            crouchAnimGroup.speedRatio = 0.3 + speedRatioFactor * 0.3;
                        }
                    }
                }
            }

            if (isMoving && !isClimbing && !isPullingUp) {
                let targetAngle = Math.atan2(move.x, move.z);
                let currentAngle = playerBox.rotation.y;
                let diff = targetAngle - currentAngle;
                while (diff < -Math.PI) diff += Math.PI * 2;
                while (diff > Math.PI) diff -= Math.PI * 2;
                // GTA-style smooth rotation — gradual turn, not instant snap
                let rotLerp = 1.0 - Math.pow(0.75, dtFactor);
                playerBox.rotation.y += diff * rotLerp;
            }
        } else {
            vVel += gravity * dtFactor;
            if (vVel < terminalVelocity) vVel = terminalVelocity;
            finalMove.y = vVel;
        }

        playerBox.moveWithCollisions(finalMove);

        var groundRay = new BABYLON.Ray(playerBox.position, new BABYLON.Vector3(0, -1, 0), 1.2);
        var gHit = scene.pickWithRay(groundRay, (m) => m !== playerBox);

        if (gHit.hit && vVel <= 0) {
            grounded = true;
            vVel = 0;
            isRunningJump = false;
        } else {
            grounded = false;
        }

        if (playerBox.position.y < -50 && !isDead) takeDamage(100);

        if (idleModel) idleModel.setEnabled(false);
        if (walkModel) walkModel.setEnabled(false);
        if (runModel) runModel.setEnabled(false);
        if (jumpModel) jumpModel.setEnabled(false);
        if (runJumpModel) runJumpModel.setEnabled(false);
        if (freefallModel) freefallModel.setEnabled(false);
        if (climbModel) climbModel.setEnabled(false);
        if (dieModel) dieModel.setEnabled(false);
        if (crouchModel) crouchModel.setEnabled(false);
        if (attackModel) attackModel.setEnabled(false);
        if (interactModel) interactModel.setEnabled(false);

        // PRIORITY SYSTEM (THIS IS THE FIX)
        if (isDead) {
            if (dieModel) dieModel.setEnabled(true);
        }
        else if (isAttacking) {
            if (attackModel) attackModel.setEnabled(true);
        }
        else if (isInteracting) {
            if (interactModel) interactModel.setEnabled(true);
        }
        else if (isClimbing) {
            if (climbModel) climbModel.setEnabled(true);
        }
        else if (isPullingUp) {
            if (jumpModel) jumpModel.setEnabled(true);
        }
        else if (!grounded) {
            if (vVel < -1.1) {
                if (freefallModel) freefallModel.setEnabled(true);
            } else if (isRunningJump) {
                if (runJumpModel) runJumpModel.setEnabled(true);
            } else {
                if (jumpModel) jumpModel.setEnabled(true);
            }
        }
        else if (grounded) {
            if (keys["c"]) {
                if (crouchModel) crouchModel.setEnabled(true);
            } else if (isMoving) {
                if (keys["shift"] && runModel) runModel.setEnabled(true);
                else if (walkModel) walkModel.setEnabled(true);
            } else if (idleModel) {
                idleModel.setEnabled(true);
            }
        }
        // SKINNER ZOMBIES — delta-time corrected with animation speed matching
        skinners.forEach(s => {
            if (!s.models.walk || !s.models.run || !s.models.bite) return;

            // STOP tracking the player entirely if the player is globally dead!
            if (isDead) {
                s.models.run.setEnabled(false);
                s.models.bite.setEnabled(false);
                if (s.models.climb) s.models.climb.setEnabled(false);
                s.models.walk.setEnabled(true); // Return to idle walking pose
                return;
            }

            var toP = playerBox.position.subtract(s.box.position);
            var heightDiff = toP.y;
            toP.y = 0;
            var trackDist = toP.length();

            // ⭐ AI SLEEP MODE (Optimization) ⭐
            // If the player is too far away, skip heavy AI math!
            if (trackDist > 160) {
                // 🧟 First 2 skinners do a creepy wall-climbing loop on buildings (ambient horror!)
                let skinnerIdx = skinners.indexOf(s);
                if (skinnerIdx < 2 && s.models.climb) {
                    s.models.walk.setEnabled(false);
                    s.models.run.setEnabled(false);
                    s.models.bite.setEnabled(false);
                    s.models.climb.setEnabled(true);
                    if (s.anims.climb) s.anims.climb.speedRatio = 0.6; // Slow creepy climb

                    // Slowly slide them up and down a building wall (no raycasts needed!)
                    let climbCycle = Math.sin(performance.now() * 0.001 + skinnerIdx * 3.0);
                    s.box.position.y = 2.0 + climbCycle * 8.0; // Bob between y=2 and y=10
                } else {
                    s.models.walk.setEnabled(true);
                    s.models.run.setEnabled(false);
                    s.models.bite.setEnabled(false);
                    if (s.models.climb) s.models.climb.setEnabled(false);
                    if (s.anims.walk) s.anims.walk.speedRatio = 0.5;
                }

                return; // ⚡ ABORT: Skips raycasts, gravity, and frame collisions saving massive CPU!
            }

            let sSpeed = 0;
            s.models.walk.setEnabled(false);
            let smellRadius = 120;
            let attackRadius = 3.5;
            let isPlayerSilent = keys["c"];
            let isPlayerAbove = heightDiff > 1.5;

            let sForward = new BABYLON.Vector3(Math.sin(s.box.rotation.y), 0, Math.cos(s.box.rotation.y));
            let sRay = new BABYLON.Ray(s.box.position.add(new BABYLON.Vector3(0, 1.5, 0)), sForward, 8.0);
            let sWallHit = scene.pickWithRay(sRay, (m) => m.name === "climbable");

            let shouldClimb = false;

            if (s.isClimbingState) {
                let topRay = new BABYLON.Ray(s.box.position.add(new BABYLON.Vector3(0, 3.5, 0)), sForward, 6.0);
                let topHit = scene.pickWithRay(topRay, (m) => m.name === "climbable");
                if (topHit.hit) shouldClimb = true;
                else {
                    s.isClimbingState = false;
                    s.yVel = 1.2;           // stronger upward launch to clear the ledge
                    s.forwardBoost = 40;     // longer forward push to get fully on top
                }
            } else {
                if (sWallHit.hit && isPlayerAbove && trackDist < smellRadius * 1.2 && !isPlayerSilent && !isDead) {
                    s.isClimbingState = true;
                    shouldClimb = true;
                }
            }

            s.models.walk.setEnabled(false);
            s.models.run.setEnabled(false);
            s.models.bite.setEnabled(false);
            if (s.models.climb) s.models.climb.setEnabled(false);

            sSpeed = 0;
            let sMoveVec = new BABYLON.Vector3(0, 0, 0);

            if (s.forwardBoost > 0) {
                s.forwardBoost -= dtFactor;
                s.models.run.setEnabled(true);
                if (s.anims.run) s.anims.run.speedRatio = 1.4;
                s.yVel += gravity * dtFactor;
                sMoveVec.y = s.yVel;
                // Strong forward push to clear the building edge
                sMoveVec.x = Math.sin(s.box.rotation.y) * 0.6 * dtFactor;
                sMoveVec.z = Math.cos(s.box.rotation.y) * 0.6 * dtFactor;
                // Temporarily disable collision so zombie doesn't get stuck on ledge
                s.box.checkCollisions = false;
            }
            else if (shouldClimb) {
                if (s.models.climb) s.models.climb.setEnabled(true);
                if (s.anims.climb) s.anims.climb.speedRatio = 1.2;

                sMoveVec.y = 0.50 * dtFactor;
                s.yVel = 0;

                let normal = sWallHit.getNormal(true);
                let climbRotLerp = 1.0 - Math.pow(0.6, dtFactor);
                s.box.rotation.y = BABYLON.Scalar.LerpAngle(s.box.rotation.y, Math.atan2(-normal.x, -normal.z), climbRotLerp);
            }
            else if (!isPlayerSilent && trackDist <= attackRadius && Math.abs(heightDiff) < 3.0 && !isDead) {
                s.models.bite.setEnabled(true);
                if (s.anims.bite) s.anims.bite.speedRatio = 1.0;
                takeDamage(3 * dtFactor);
                toP.normalize();
                let biteRotLerp = 1.0 - Math.pow(0.8, dtFactor);
                s.box.rotation.y = BABYLON.Scalar.LerpAngle(s.box.rotation.y, Math.atan2(toP.x, toP.z), biteRotLerp);
                s.yVel += gravity * dtFactor;
                sMoveVec.y = s.yVel;
            }
            else if (!isPlayerSilent && trackDist <= smellRadius && !isDead) {
                if (isPlayerAbove) {
                    s.models.walk.setEnabled(true);
                    sSpeed = 0.25;
                    if (s.anims.walk) s.anims.walk.speedRatio = 1.0;
                } else {
                    s.models.run.setEnabled(true);
                    sSpeed = 0.55;
                    if (s.anims.run) s.anims.run.speedRatio = 1.4;
                }
                toP.normalize();
                let chaseRotLerp = 1.0 - Math.pow(0.85, dtFactor);
                s.box.rotation.y = BABYLON.Scalar.LerpAngle(s.box.rotation.y, Math.atan2(toP.x, toP.z), chaseRotLerp);
                s.wanderAngle = s.box.rotation.y;
                s.yVel += gravity * dtFactor;
                sMoveVec.y = s.yVel;
            }
            else {
                s.models.walk.setEnabled(true);
                sSpeed = 0.15;
                if (s.anims.walk) s.anims.walk.speedRatio = 0.7;

                s.turnTimer -= dtFactor;
                if (s.turnTimer <= 0) {
                    s.wanderAngle += (Math.random() - 0.5) * Math.PI;
                    s.turnTimer = 100 + Math.random() * 200;
                }

                if (sWallHit.hit && s.turnTimer < 40) {
                    s.wanderAngle += Math.PI / 2 + Math.random() * Math.PI;
                    s.turnTimer = 80;
                }

                let wanderRotLerp = 1.0 - Math.pow(0.95, dtFactor);
                s.box.rotation.y = BABYLON.Scalar.LerpAngle(s.box.rotation.y, s.wanderAngle, wanderRotLerp);
                toP = new BABYLON.Vector3(Math.sin(s.box.rotation.y), 0, Math.cos(s.box.rotation.y));
                s.yVel += gravity * dtFactor;
                sMoveVec.y = s.yVel;
            }

            if (s.yVel < terminalVelocity) s.yVel = terminalVelocity;

            if (sSpeed > 0 && !shouldClimb && s.forwardBoost <= 0) {
                sMoveVec.addInPlace(toP.scale(sSpeed * dtFactor));
            } else if (shouldClimb) {
                sMoveVec.x = 0;
                sMoveVec.z = 0;
            }

            // Re-enable collision after forward boost ends
            if (s.forwardBoost <= 0 && !s.box.checkCollisions) {
                s.box.checkCollisions = true;
            }

            s.box.moveWithCollisions(sMoveVec);

            // If zombie is stuck inside a building, push them out
            let unstuckRay = new BABYLON.Ray(s.box.position.add(new BABYLON.Vector3(0, 1, 0)), sForward, 0.5);
            let stuckHit = scene.pickWithRay(unstuckRay, (m) => m.name === "climbable");
            if (stuckHit && stuckHit.hit && !shouldClimb && s.forwardBoost <= 0) {
                // Push zombie backward away from the wall
                let pushBack = new BABYLON.Vector3(-Math.sin(s.box.rotation.y) * 0.3, 0, -Math.cos(s.box.rotation.y) * 0.3);
                s.box.position.addInPlace(pushBack);
                s.wanderAngle += Math.PI; // turn around
                s.turnTimer = 60;
            }

            // BOUNDARY: Skinners ONLY roam inside the cramped grid city on the right (x > 300)
            if (s.box.position.x < 300) {
                s.box.position.x = 305;
                s.wanderAngle += Math.PI; // force them to turn back around deeply into the cramped buildings!
            }

            if (!s.isClimbingState) {
                var sGroundRay = new BABYLON.Ray(s.box.position.add(new BABYLON.Vector3(0, 0.1, 0)), new BABYLON.Vector3(0, -1, 0), 1.5);
                var sGHit = scene.pickWithRay(sGroundRay, (m) => m !== s.box && m.name !== "climbable");
                if (sGHit.hit && s.yVel <= 0) s.yVel = 0;
            }

            if (shouldClimb && s.models.climb) {
                s.models.climb.setEnabled(true);
                s.models.walk.setEnabled(false);
                s.models.run.setEnabled(false);
                s.models.bite.setEnabled(false);
            }
        });

        // BASIC ZOMBIES — delta-time corrected with animation speed matching
        basicZombies.forEach(b => {
            if (b.isDead) {
                var toP = playerBox.position.subtract(b.box.position);
                toP.y = 0;
                if (toP.length() > 150) {
                    b.isDead = false;
                    b.health = 3;
                    b.box.rotation.x = 0;
                    b.box.position.y = 2;
                    b.isEating = true;
                    b.chaseTimer = 0;
                    if (b.walkModel) b.walkModel.setEnabled(false);
                    if (b.eatModel) b.eatModel.setEnabled(true);
                }
                return; // Skip walking/eating update
            }

            // STOP attacking the player entirely if the player is globally dead!
            if (isDead) {
                if (b.walkModel) b.walkModel.setEnabled(false);
                if (b.eatModel) b.eatModel.setEnabled(true); // Resume raw eating
                return;
            }

            if (!b.walkModel || !b.eatModel) return;

            var toP = playerBox.position.subtract(b.box.position);
            toP.y = 0;
            let dist = toP.length();

            // ⭐ AI SLEEP MODE (Optimization) ⭐
            // If player is far away, force passive eating state and completely skip all physics/AI!
            if (dist > 140) {
                b.isEating = true;
                b.eatModel.setEnabled(true);
                b.walkModel.setEnabled(false);
                b.chaseTimer = 0;
                return; // ⚡ ABORT: No CPU math or collisions!
            }

            if (b.isEating) {
                if (dist < 45) {
                    b.isEating = false;
                    b.chaseTimer = 180;
                    b.eatModel.setEnabled(false);
                    b.walkModel.setEnabled(true);
                }
            } else {
                if (dist < 120) {
                    toP.normalize();
                    let zombieRotLerp = 1.0 - Math.pow(0.88, dtFactor);
                    b.box.rotation.y = BABYLON.Scalar.LerpAngle(b.box.rotation.y, Math.atan2(toP.x, toP.z), zombieRotLerp);
                    let moveVec = toP.scale(0.20 * dtFactor);

                    let forwardDir = new BABYLON.Vector3(Math.sin(b.box.rotation.y), 0, Math.cos(b.box.rotation.y));
                    let wallRay = new BABYLON.Ray(b.box.position.add(new BABYLON.Vector3(0, 1.0, 0)), forwardDir, 2.5);
                    let wallHit = scene.pickWithRay(wallRay, (m) => m.name === "climbable");
                    if (wallHit.hit) {
                        b.box.rotation.y += Math.PI / 2;
                    }

                    b.box.moveWithCollisions(moveVec);

                    // BOUNDARY: Basic zombies stay inside forest and town (x < -50)
                    if (b.box.position.x > -50) {
                        b.box.position.x = -50;
                    }
                    if (dist < 2.0 && !isDead) {
                        takeDamage(0.4 * dtFactor); // Slow damage - only triggers on physical touch!
                    }
                    b.chaseTimer -= dtFactor;
                } else {
                    b.chaseTimer = 0;
                }

                if (b.chaseTimer <= 0) {
                    b.isEating = true;
                    b.walkModel.setEnabled(false);
                    b.eatModel.setEnabled(true);
                }
            }
        });
    });

    // ===== 🌫️ ULTRA-REALISTIC VOLUMETRIC APOCALYPSE FOG =====
    // High-resolution procedural wispy smoke texture
    let fogTexture = new BABYLON.DynamicTexture("fogTex", 512, scene);
    let fogCtx = fogTexture.getContext();
    fogCtx.clearRect(0, 0, 512, 512);
    
    // Create a very soft, layered noise pattern for a "misty" feel
    for(let i = 0; i < 25; i++) {
        let x = 256 + (Math.random() - 0.5) * 300;
        let y = 256 + (Math.random() - 0.5) * 300;
        let r = 80 + Math.random() * 150;
        let g = fogCtx.createRadialGradient(x, y, 0, x, y, r);
        let alpha = 0.05 + Math.random() * 0.1; // Extremely subtle layers
        g.addColorStop(0, `rgba(180, 185, 195, ${alpha})`);
        g.addColorStop(0.5, `rgba(180, 185, 195, ${alpha * 0.5})`);
        g.addColorStop(1, "rgba(180, 185, 195, 0)");
        fogCtx.fillStyle = g;
        fogCtx.fillRect(0, 0, 512, 512);
    }
    fogTexture.update();

    var apocalypseFog = new BABYLON.ParticleSystem("apocalypseFog", 6000, scene);
    apocalypseFog.particleTexture = fogTexture;
    
    // Smooth blending modes to prevent "popping" or "patchiness"
    apocalypseFog.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    
    // Emitter covers the whole base with a slight vertical range for depth
    apocalypseFog.emitter = new BABYLON.Vector3(0, 0, 0);
    apocalypseFog.minEmitBox = new BABYLON.Vector3(-800, -2, -400);
    apocalypseFog.maxEmitBox = new BABYLON.Vector3(800, 4, 400); 

    // Colors: Brighter mist tint for visibility while maintaining scary atmosphere
    apocalypseFog.color1 = new BABYLON.Color4(0.8, 0.8, 0.85, 0.0);
    apocalypseFog.color2 = new BABYLON.Color4(0.75, 0.75, 0.8, 0.25); // Further brightened for visibility
    apocalypseFog.colorDead = new BABYLON.Color4(0.6, 0.6, 0.65, 0.0);

    // Size: Massive scale overlaps to create a continuous "sheet" of mist
    apocalypseFog.minSize = 120;
    apocalypseFog.maxSize = 250;
    
    // Life: Very long life so they move slowly and stay in the scene
    apocalypseFog.minLifeTime = 15;
    apocalypseFog.maxLifeTime = 25;
    
    // High density with very slow updates to prevent "glitching"
    apocalypseFog.emitRate = 1200; 
    apocalypseFog.updateSpeed = 0.003;
    
    // Soft Swirl: Makes the mist look alive and "roaming"
    apocalypseFog.minAngularSpeed = -0.05;
    apocalypseFog.maxAngularSpeed = 0.05;
    apocalypseFog.minInitialRotation = 0;
    apocalypseFog.maxInitialRotation = Math.PI * 2;

    // Movement: Drifting "mystery" wind
    apocalypseFog.direction1 = new BABYLON.Vector3(-0.3, 0, -0.3);
    apocalypseFog.direction2 = new BABYLON.Vector3(0.3, 0.02, 0.3);

    // No Popping: Smooth size growth over the first 20% of life
    apocalypseFog.addSizeGradient(0, 0.2); 
    apocalypseFog.addSizeGradient(0.2, 1.0);
    apocalypseFog.addSizeGradient(1.0, 1.2);

    // Layering: Prevents visible seams between particles
    apocalypseFog.preWarmCycles = 200; // Starts the fog already filled in
    apocalypseFog.preWarmStepOffset = 20;

    apocalypseFog.start();

    // Scene-wide Deep Atmosphere (The "Dark Mystery Forest" look)
    scene.fogEnabled = true;
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2; 
    scene.fogDensity = 0.0015; // Slightly more transparent for brightness
    scene.fogColor = new BABYLON.Color3(0.12, 0.13, 0.15); // Darker grey-blue tint for the world atmosphere

    // ===== HIGH-PERFORMANCE OCTREE =====
    // Note: Temporarily commented out to prevent fatal game crash if unsupported by Babylon version
    // scene.createOrUpdateSelectionOctree();

    return scene;
};

var scene = createScene();
engine.runRenderLoop(() => scene.render());
window.onresize = () => engine.resize();

