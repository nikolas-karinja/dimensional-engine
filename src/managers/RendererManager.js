import * as Utils from '../util'
import * as THREE from '../../node_modules/three/build/three.module.js'
import { Renderer } from '../core/Renderer.js'

class RendererManager {

    constructor ( engine ) {

        this.Engine = engine
        this.Renderers = new Utils.Renderer.RendererStorageTable()

        this.Settings = {
            PostProcessing: {
                enabled: true,
            },
            Shadows: {
                enabled: true,
                
                Map: {
                    type: THREE.BasicShadowMap,
                },
            },
        }

    }

    async addDepthBasedMesh ( rendererName, mesh ) {

        const RENDERER = this.Renderers.get( rendererName )

        await RENDERER.addDepthBasedMesh( mesh )

    }

    async removeDepthBasedMesh ( rendererName, mesh ) {

        const RENDERER = this.Renderers.get( rendererName )

        await RENDERER.removeDepthBasedMesh( mesh.uuid )

    }

    async buildRenderer ( name, scene, camera, params = {} ) {

        const RENDERER = new Renderer( this, scene, camera, params )

        this.Renderers.add( name, RENDERER )

        this.Engine.Tools.RendererInterface.selectRenderer( name )
        this.Engine.Tools.RendererInterface.refreshRendererList()

    }

    get ( name ) {

        return this.Renderers.get( name )

    }

    resize () {

        for ( const r in this.Renderers.Collection ) {

            this.Renderers.Collection[ r ].resize()

        }

    }

    update ( deltaTime ) {

        for ( let i of this.Renderers.active ) {

            this.Renderers.Collection[ i ].render( deltaTime )

        }

    }

}

export { RendererManager }