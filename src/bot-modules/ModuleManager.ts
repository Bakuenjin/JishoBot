import Module from "./meta/Module"

export default class ModuleManager {
    private static instance: ModuleManager

    public static getInstance(): ModuleManager {
        if (!this.instance)
            this.instance = new ModuleManager()
        return this.instance
    }

    private constructor() {}

    private setupModule(mod: Module): void {
        mod.setup()
    }

    public setupModules(modules: Module[]): void {
        modules.forEach(this.setupModule)
    }

}