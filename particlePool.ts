
class Pool {

    array:Array<Particle>
    currentIndex:number
    maxIndex:number

    constructor (count:number) {
        this.array = new Array(count);
        this.currentIndex = count - 1;
        this.maxIndex = this.currentIndex;
    }
}

class ParticlePool extends Pool {

    constructor (count:number) {
        super(count)

        const array = this.array;

        for (let i = 0; i < count; i++) {
            array[i] = new Particle();
        }
    }

    public ejectParticles (count:number) {

        this.allocateMoreParticles(count);
        
        const returnArray = new Array(count);
        const poolArray = this.array;
        let returnArrayIndex = 0;
        let startPoolIndex = this.currentIndex - count;
        let endPoolIndex = this.currentIndex;
        
        for (; startPoolIndex < endPoolIndex; returnArrayIndex++, endPoolIndex--) {
            returnArray[returnArrayIndex] = poolArray[endPoolIndex];
            poolArray[endPoolIndex] = null!;
        }

        this.currentIndex -= count;

        return returnArray;
    }

    public injectParticles (particles:Array<Particle>) {

        let writeIndex = this.currentIndex + 1;
        let writeMaxIndex = writeIndex + particles.length;
        let parameterArrayIndex = 0;

        const poolArray = this.array;

        for (; writeIndex <= writeMaxIndex; writeIndex++, parameterArrayIndex++) {
            poolArray[writeIndex] = particles[parameterArrayIndex];
        }

        this.currentIndex += particles.length;
        
    }
    
    private allocateMoreParticles (requestedCount:number) {
        
        const currentParticleCount = this.currentIndex + 1;
            
        if (requestedCount > currentParticleCount) {

            console.warn("Particle allocation required.");
            const numberOfNewParticles = requestedCount - currentParticleCount;
            const numberOfEndingNulls = this.maxIndex - this.currentIndex;
            const totalNumberOfAll = numberOfNewParticles + numberOfEndingNulls;

            let writeIndex = this.currentIndex + 1;

            const particleMaxIndex = this.currentIndex + numberOfNewParticles;         // maximum writeIndex for particle addition
            const nullMaxIndex = particleMaxIndex + numberOfEndingNulls;        // maximum writeIndex for null addition
            
            for (; writeIndex <= particleMaxIndex; writeIndex++) {
                this.array[writeIndex] = new Particle();
            }
            this.currentIndex = writeIndex - 1;

            // allocating nulls
            // borrowed particles are expected to return
            for (; writeIndex <= nullMaxIndex; writeIndex++) {
                this.array[writeIndex] = null!;
            }
            
            this.maxIndex = writeIndex - 1;
        }
    }
}