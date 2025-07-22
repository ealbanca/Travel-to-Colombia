// Debug script to test package loading
import { getTravelPackages } from './externalServices.mjs';

async function testPackageLoading() {
    console.log('Testing package loading...');
    
    try {
        const bogotaPackages = await getTravelPackages('bogota');
        console.log('Bogotá packages:', bogotaPackages);
        
        const medellinPackages = await getTravelPackages('medellin');
        console.log('Medellín packages:', medellinPackages);
        
        const cartagenaPackages = await getTravelPackages('cartagena');
        console.log('Cartagena packages:', cartagenaPackages);
        
    } catch (error) {
        console.error('Error testing packages:', error);
    }
}

testPackageLoading();
