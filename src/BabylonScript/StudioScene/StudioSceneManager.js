import * as BABYLON from 'babylonjs';
import * as BABYLONMaterials from 'babylonjs-materials';
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

import 'pepjs';
import 'babylonjs-loaders';

import * as  studioModules from  "../StudioScene/StudioSceneModules";
import  LoaderManager  from './LoaderManager';




export default class StudioSceneManager{
    constructor(game) {
        this.game=game;
        //Main Props
        this.scene=null;
        this.studioGui=null;
        this.mainCamera=null;
        this.pipline=null;
    
        //Input Manager
        this.InputMg={isDragging:false, startPoint : null,
            currentTouchedMesh: null , currentSelectedMesh:null, MeshIndex : 0, dragLimitation:null, currentMeshDevOpts: null  }
        this.snapValue=5.5;

        //Val's
        this.IsComponentTab=false;
    }

    //#region  MainSceneProperties
    CreateScene () { //Create Bts Scene
        //Create Scene
            this.scene = new BABYLON.Scene(this.game.engine);
            this.scene.clearColor = new BABYLON.Color4(0.95, 0.95, 0.95, 1.0);
            this.scene.imageProcessingConfiguration.colorCurvesEnabled = true;
            this.scene.imageProcessingConfiguration.colorCurves = new BABYLON.ColorCurves();
            this.scene.imageProcessingConfiguration.colorCurves.globalSaturation = 0;
            this.scene.imageProcessingConfiguration.contrast = 2.5;
            this.scene.imageProcessingConfiguration.vignetteEnabled = true;
    
            this.scene.onPointerObservable.add((pointerInfo) => {
                switch (pointerInfo.type) {
                    case BABYLON.PointerEventTypes.POINTERDOWN:
                        console.log("POINTER DOWN");
                        this.onPointerDown(pointerInfo.event)
                        break;
                    case BABYLON.PointerEventTypes.POINTERUP:
                        console.log("POINTER UP");
                        this.onPointerUp(pointerInfo.event)
                        break;
                    case BABYLON.PointerEventTypes.POINTERMOVE:
                        this.onPointerMove(pointerInfo.event)
                        break;  
                    case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                        if(this.InputMg.currentSelectedMesh){//Item Selected Before
                            this.InputMg.currentSelectedMesh.showBoundingBox=false;
                        }
                        break;  
                    case BABYLON.PointerEventTypes.POINTERWHEEL:
                        this.MouseWheelHandler();
                        break; 
                    default:
                    break;
                }
            });
    
    
            //Installation
            this.createCamera();
            this.setUpEnvironMent();

            //Create LoadManager instance
            this.loaderManager = new LoaderManager(this);
            this.loaderManager.loadMainBike(); //start load mainBike
    
    
    
            // this.scene.debugLayer.show();
            // this.scene.getBoundingBoxRenderer().showBackLines = true;
            this.scene.getBoundingBoxRenderer().backColor = new BABYLON.Color3(254/255, 153/255, 52/255);
            this.scene.getBoundingBoxRenderer().frontColor = new BABYLON.Color3(254/255, 153/255, 52/255);
        
            return  this.scene;
    }
    createCamera () {
        this.mainCamera = new BABYLON.ArcRotateCamera("ArcCamera",
            306, 63, 60, new BABYLON.Vector3(0, 5.5, 0), this.scene);
        this.mainCamera.attachControl(this.game.canvas,true);
        this.mainCamera.alpha = 5.45;
        this.mainCamera.beta = 1.35;

        this.mainCamera.lowerRadiusLimit = 23;
        this.mainCamera.upperRadiusLimit = 70;

        this.mainCamera.upperBetaLimit=1.5;

        this.mainCamera.minZ=0.2;
        this.mainCamera.wheelPrecision = 10;
        this.mainCamera.useBouncingBehavior = true;

    }
    setUpEnvironMent () {

        let hemiLight= new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0.3, 1, -0.3), this.scene);
        hemiLight.intensity=1;
        // hemiLight.groundColor =new BABYLON.Color3(62/255,62/255,62/255);
        // hemiLight.position = new BABYLON.Vector3(1, 50, -2);

        let dirLight = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(.2, -1, -.3), this.scene);
            dirLight.position = new BABYLON.Vector3(3, 9, 3);

        this.alphaMaterial = new BABYLON.StandardMaterial("alphaMat", this.scene);
        this.alphaMaterial.alpha= 0;

        // ShadowGenerator
        this.shadowGenerator = new BABYLON.ShadowGenerator(512, dirLight);
        this.shadowGenerator.useBlurExponentialShadowMap = true;
        // this.shadowGenerator.forceBackFacesOnly = true;
        // this.shadowGenerator.blurKernel = 32;
        // this.shadowGenerator.depthScale = 150;
            dirLight.intensity = 0.72;
            dirLight.shadowMinZ = 0;
            dirLight.shadowMaxZ = 500;
        this.shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH;

        
        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        let ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 150, this.scene);
        ground.receiveShadows = true;
        
        // Create and tweak the background material.
        var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", this.scene);
        backgroundMaterial.diffuseTexture = new BABYLON.Texture("./Textuers/Scene/backgroundGround.png", this.scene);
        backgroundMaterial.diffuseTexture.hasAlpha = true;
        backgroundMaterial.opacityFresnel = false;
        backgroundMaterial.shadowLevel = .8;
        backgroundMaterial.alpha = .3;

        //Create CubicTexture
        let skyboxCubecTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
            // this.skyboxPath,
                "./environment/empty_warehouse2.env",
                this.scene
                );
            skyboxCubecTexture.gammaSpace = true;     
            skyboxCubecTexture.level = .8;
        this.scene.environmentTexture=skyboxCubecTexture;

        //Mirror
        this.mirror = new BABYLON.MirrorTexture("mirror", 512, this.scene);
        this.mirror.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
        this.mirror.adaptiveBlurKernel = 32;
        // this.Groundmirror.mirrorPlane = new BABYLON.Plane(0, -.69, -0, -1);
        backgroundMaterial.reflectionTexture = this.mirror;
        backgroundMaterial.reflectionFresnel = true;
        backgroundMaterial.reflectionStandardFresnelWeight = 0.9;
        backgroundMaterial.reflectionTexture.level = .8;
        ground.material = backgroundMaterial;

        // var box2 = BABYLON.MeshBuilder.CreateBox("box", {height: 1}, this.scene);
        // box2.position.y +=.5;
        // this.mirror.renderList.push(box2);
        // this.shadowGenerator.addShadowCaster(box2);    

        // //Create RenderPipline
        // this.RenderPipline = new BABYLON.DefaultRenderingPipeline("default", // The name of the pipeline
        // true, // Do you want HDR textures ?
        // this.scene, // The scene instance
        // [this.mainCamera] // The list of cameras to be attached to
        // );

        // this.RenderPipline.samples = 4;
        // this.RenderPipline.bloomEnabled=true;
        // // this.RenderPipline.glowLayer.intensity=3.5;
        // // this.RenderPipline.glowLayer.blurKernelSize=180;

        // this.RenderPipline.MineglowLayer =new BABYLON.GlowLayer("glowww", this.scene, { 
        //     mainTextureFixedSize: 512,
        //     blurKernelSize: 190
        //     }
        // );
        // this.RenderPipline.MineglowLayer.intensity = 2.70;

        //#region fff
        var alpha = 0;
        this.scene.registerBeforeRender(() => {
            // if(!this.currentStyle || !this.IsComponentTab || this.InputMg.isDragging ){
            //     return
            // }
                
            // this.displayUiComponents();
            // this.selectStyleFace();
            // alpha += 0.07;
            // this.Highlighter.blurHorizontalSize = 0.3 + Math.cos(alpha ) * 0.7 + 0.7;        
            // this.Highlighter.blurVerticalSize = 0.3 + Math.sin(alpha /3 ) * 0.7 + 0.7;
        });
        //#endregion

        
        var skyBack = new BABYLON.Layer("skyBack", "./Textuers/Scene/skyBack_edit.png", this.scene,true, new BABYLON.Color4(1,1,1,1));

        // var skyBack = new BABYLON.Layer("skyBack", "./Textuers/Scene/skyBack.png", this.scene,true, new BABYLON.Color4(.55,.55,.55,.65));
        // var vignette = new BABYLON.Layer("vignette", "./Textuers/Scene/vignette.png", this.scene,true, new BABYLON.Color4(1,1,1,.9));
    }
    //#endregion
        
    //#region  StylesOpt's
    selectStyleFace (targetFaceType = null) {
            // targetFaceType = (targetFaceType) ? targetFaceType : studioModules.geFaceByAngle(this.mainCamera.alpha, this.currentStyleData.anglesRange) ;
            
            // let targetMesh = null;
            // switch (targetFaceType) {
            //     case studioModules.faceTypeEnum.frontFace:
            //         targetMesh= this.currentStyle.draggedSurfaces.frontWall;
            //         break;
            //     case studioModules.faceTypeEnum.backFace:
            //         targetMesh= this.currentStyle.draggedSurfaces.backWall;
            //         break;
            //     case studioModules.faceTypeEnum.leftFace:
            //         targetMesh= this.currentStyle.draggedSurfaces.leftWall;
            //         break;    
            //     case studioModules.faceTypeEnum.rightFace:
            //         targetMesh= this.currentStyle.draggedSurfaces.rightWall;
            //         break;
            //     default:
            //         return;
            // };

            // // console.log("Trying to Updated!!!")
            

            // if( this.selectedFace && this.selectedFace.name === targetMesh.name) //if exists and the same
            //     return;

            // this.removeFaceHighLight_IfExists() //if exists and not the same
            // this.Highlighter.addMesh(targetMesh, new BABYLON.Color3(254/255, 153/255, 52/255)); //else not exists before
            
            // this.selectedFace = targetMesh;
    }
    removeFaceHighLight_IfExists () {
        if(this.selectedFace) //if exists and not the same
        this.Highlighter.removeMesh(this.selectedFace);
    }
    displayUiComponents () {
        if( this.camInit.radius === this.mainCamera.radius
            && this.camInit.alpha === this.mainCamera.alpha
            && this.camInit.beta === this.mainCamera.beta ){ //same
            // console.log("same");
            if(!this.Isexecuted){
                // console.log("do it !!");
                this.handlers.onDrop(this.showComponentsIcons()) //display all components ui
                this.Isexecuted=true;
            }

        }else{ //diff
            this.camInit.radius = this.mainCamera.radius;
            this.camInit.alpha = this.mainCamera.alpha;
            this.camInit.beta = this.mainCamera.beta
            if(this.Isexecuted){
                // console.log("don'ttttttt");
                this.handlers.onDrop(this.hideComponentsIcons()) //hide all components ui
            }
            this.Isexecuted=false;
            // console.log("difff");
        }
    }
    //#endregion
        
    //#region UserInput (Mouse)
    onPointerDown (ev) {
        console.log("Mouse Down");
        if (ev.button !== 0 ) {
            return;
        }

        if(this.InputMg.currentSelectedMesh){//Item Selected Before
            this.InputMg.currentSelectedMesh.showBoundingBox=false;
        }
        //Pick Item To Move
        var pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);//, function (mesh) { return mesh !=ground });
        if (pickInfo.hit && pickInfo.pickedMesh.tag ===  "item" &&  this.IsComponentTab) {
            console.log( " */ " ,pickInfo.pickedMesh.name," */ ");
    
        }
    }
    onPointerUp (ev) {
        console.log("Up Mouse");
        if (this.InputMg.currentTouchedMesh) {

        }
    }
    onPointerMove (ev){
    }
    MouseWheelHandler (ev){

    }
    getGroundPosition (touchedMesh) {
        var pickinfo = this.scene.pick(this.scene.pointerX,
            this.scene.pointerY,  (mesh) => { return mesh === this.selectedFace; });
        if (pickinfo.hit){
            return pickinfo.pickedPoint;
        }
        // return this.VectorSnapping( pickinfo.pickedPoint);
        return null;
    }
    VectorSnapping (VtoSnap) {
        var sanpedVector=new BABYLON.Vector3.Zero();
        sanpedVector.x=this.round(VtoSnap.x);
        sanpedVector.y=0;
        sanpedVector.z=this.round(VtoSnap.z);
        
        return sanpedVector;
    }
    round (input){
        return this.snapValue * Math.round((input/this.snapValue));
    }
    //#endregion

    //#region Colliders
    setWallComponentsCollider (selectedFace){ //loop on all wall components
        console.log("selectedFace", selectedFace)
        for (let i = 0; i < selectedFace.attachedComponents.length; i++) {  //Set Trriger Events for all OBJ   
            this.setComponentCollider(selectedFace, i);
        }
    }
    setComponentCollider  (selectedFace, index){
        let targetObj = selectedFace.attachedComponents[index];
        targetObj.actionManager=new BABYLON.ActionManager(this.scene);
        console.log("Set Events ",targetObj.name);
        console.log("Set Events 22 ",targetObj.targetMat.name);

        for (let i = 0; i < selectedFace.attachedComponents.length; i++) {
    
            let currentComp = selectedFace.attachedComponents[i];

            if(currentComp.uniqueId !== targetObj.uniqueId){
                targetObj.actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(
                        {
                            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                            parameter: currentComp
                        },
                        function () { 
                            targetObj.material.alpha= .1;
                            targetObj.material.diffuseColor=BABYLON.Color3.Red();
                            targetObj.opts.inGoodPos=false;
                        },
                        new BABYLON.PredicateCondition(
                            targetObj.actionManager,
                            () => {
                                return targetObj.opts.isDragged;
                            }
                        )
                    )
                );
                targetObj.actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(
                        {
                            trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
                            parameter: currentComp
                        },
                        function () { 
                            targetObj.opts.inGoodPos=true;
                            targetObj.material.alpha= 0;
                            targetObj.material.diffuseColor=BABYLON.Color3.White();
                            console.log('Exit Obj');
                        },
                        new BABYLON.PredicateCondition(
                            targetObj.actionManager,
                            () => {
                                return targetObj.opts.isDragged;
                            }
                        )
                    )
                );
            }
        }
    }
    CheckComponentReliability (component){
        console.log("Stayed 0 " , component.opts.startedPoint);

        if(!component.opts.inGoodPos){
            console.log("Stayed " , component.opts.startedPoint);
            component.position=new BABYLON.Vector3( component.opts.startedPoint.x,component.position.y,component.opts.startedPoint.z);
            component.opts.inGoodPos=true;
            component.material.diffuseColor=BABYLON.Color3.White();
        }
    }
    //#endregion
        
    //#region Components Icons
    showComponentsIcons (){
        if(!this.selectedFace){
            return []
        }

        let componentsUiData = [];
        componentsUiData=this.selectedFace.attachedComponents.map((component)=>{
                let targetPoint = this.get2dPointFromPos(component);
            return {
                catType:component.catType,
                id:component.uniqueId,
                left : targetPoint.x,
                top : targetPoint.y,
                configs : component.configs,
                isSelected:component.isSelected,
            }
        });

        console.log("Showed ",componentsUiData );
        console.log("Showed 0 ",this.selectedFace.attachedComponents );

        return componentsUiData
    }
    hideComponentsIcons (){
        if(!this.selectedFace) return [];
        for (let i = 0; i < this.selectedFace.attachedComponents.length; i++) {//unselect all selected
            this.selectedFace.attachedComponents[i].isSelected=false;
        }
        return [];
    }
    get2dPointFromPos (component){
        const {dragOpt:{boundersFactors, movingAxisKey}} = this.selectedFace;

        let pointIn3d= component.position.clone();
        pointIn3d[movingAxisKey] += boundersFactors.endPoint[movingAxisKey] * (component.opts.modelWidth/2); //left component
        pointIn3d.y += (component.opts.modelHeight); //up part
    
        var point = BABYLON.Vector3.Project( pointIn3d, 
        BABYLON.Matrix.Identity(), 
        this.scene.getTransformMatrix(), 
        this.mainCamera.viewport.toGlobal(this.game.engine.getRenderWidth(), this.game.engine.getRenderHeight()),
        );
        point.x += ( window.innerWidth - this.game.engine.getRenderWidth() )
        point.y += ( window.innerHeight - this.game.engine.getRenderHeight() )
        
        return point;
    }
    //#endregion
        
    //#region  CameraAnimation
    CameraZoomAnimation (zoomIn){
        let zoomSgin= (zoomIn) ? -1 : 1;
        this.mainCamera.animations=[];

        var CameraZoomAnim = new BABYLON.Animation(
            "ZoomAnimation",
            "radius",
                60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
            );
            // diffuseColor
        var keys = []; 
        keys.push({
            frame: 0,
            value: this.mainCamera.radius
            // outTangent: new BABYLON.Vector3(1, 1, 1)
        });
        keys.push({
            frame: 100,
            value: this.mainCamera.radius+(zoomSgin*this.zoomVlaue)
            // outTangent: new BABYLON.Vector3(1, 1, 1)
        });
        CameraZoomAnim.setKeys(keys);
        this.mainCamera.animations.push(CameraZoomAnim);
        this.scene.beginAnimation(this.mainCamera, 0, 100, false,7);

    }
    ItemFoucsAnimation (){
        if(!this.InputMg.currentSelectedMesh)
            return;
            
        var CamTargetAnim = new BABYLON.Animation(
            "CamTargetAnimation",
            "target",
                60,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
            );
            // diffuseColor
        var keys = []; 
        keys.push({
            frame: 0,
            value: this.mainCamera.target.clone()
            // outTangent: new BABYLON.Vector3(1, 1, 1)
        });
        keys.push({
            frame: 100,
            value: this.InputMg.currentSelectedMesh.position.clone()
            // outTangent: new BABYLON.Vector3(1, 1, 1)
        });
        CamTargetAnim.setKeys(keys);

        var CamRadiusAnim = new BABYLON.Animation(
            "CamRadiusAnimation",
            "radius",
                60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
            );
        keys = []; 
        keys.push({
            frame: 0,
            value: this.mainCamera.radius
            // outTangent: new BABYLON.Vector3(1, 1, 1)
        });
        keys.push({
            frame: 100,
            value: 40
            // outTangent: new BABYLON.Vector3(1, 1, 1)
        });
        CamRadiusAnim.setKeys(keys);
        
        this.mainCamera.ItemFoucsAnimation = (this.mainCamera.ItemFoucsAnimation) ? this.mainCamera.ItemFoucsAnimation.dispose() : null;
        
        this.mainCamera.ItemFoucsAnimation = new BABYLON.AnimationGroup("ItemFoucsGroup",this.scene)
        this.mainCamera.ItemFoucsAnimation.addTargetedAnimation(CamTargetAnim, this.mainCamera);
        this.mainCamera.ItemFoucsAnimation.addTargetedAnimation(CamRadiusAnim, this.mainCamera);

        // Make sure to normalize animations to the same timeline
        this.mainCamera.ItemFoucsAnimation.normalize(0, 100);
        this.mainCamera.ItemFoucsAnimation.speedRatio = 2.5;
        this.mainCamera.ItemFoucsAnimation.play();
    }
    //#endregion
};

