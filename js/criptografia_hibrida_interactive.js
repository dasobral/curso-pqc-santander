// Visualización interactiva para criptografía híbrida
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const generateKeysBtn = document.getElementById('generate-hybrid-keys-btn');
    const encapsulateBtn = document.getElementById('encapsulate-btn');
    const decapsulateBtn = document.getElementById('decapsulate-btn');
    const attackSimulateBtn = document.getElementById('attack-simulate-btn');
    const hybridSchemeSelect = document.getElementById('hybrid-scheme-select');
    const statusOutput = document.getElementById('hybrid-status-output');
    const keysDisplay = document.getElementById('hybrid-keys-display');
    const encapsulationDisplay = document.getElementById('encapsulation-display');
    const sharedKeyDisplay = document.getElementById('shared-key-display');
    const attackResultsDisplay = document.getElementById('attack-results-display');
    
    // Variables para almacenar datos
    let aliceKeys = null;
    let bobKeys = null;
    let encapsulation = null;
    let sharedKey = null;
    let selectedScheme = "serial";
    
    // Función para simular la generación de claves híbridas
    function generateHybridKeys() {
        selectedScheme = hybridSchemeSelect.value;
        statusOutput.innerHTML = `Generando claves para esquema híbrido ${getSchemeDisplayName(selectedScheme)}...`;
        
        // Simulación de generación de claves
        setTimeout(() => {
            // Generar valores aleatorios para simular claves
            aliceKeys = generateRandomKeys(selectedScheme);
            bobKeys = generateRandomKeys(selectedScheme);
            
            // Mostrar claves
            keysDisplay.innerHTML = `
                <h4>Claves de Alice:</h4>
                <pre>${formatKeys(aliceKeys, selectedScheme)}</pre>
                <h4>Claves de Bob:</h4>
                <pre>${formatKeys(bobKeys, selectedScheme)}</pre>
            `;
            
            statusOutput.innerHTML = `Par de claves híbridas (${getSchemeDisplayName(selectedScheme)}) generado correctamente.`;
            
            // Habilitar botón de encapsulamiento
            encapsulateBtn.disabled = false;
            decapsulateBtn.disabled = true;
            attackSimulateBtn.disabled = true;
            encapsulationDisplay.innerHTML = "";
            sharedKeyDisplay.innerHTML = "";
            attackResultsDisplay.innerHTML = "";
            
        }, 1500); // Simular tiempo de procesamiento
    }
    
    // Función para simular el encapsulamiento de clave
    function encapsulateKey() {
        if (!aliceKeys || !bobKeys) {
            statusOutput.innerHTML = "Error: Primero debe generar claves híbridas.";
            return;
        }
        
        statusOutput.innerHTML = `Encapsulando clave compartida usando esquema ${getSchemeDisplayName(selectedScheme)}...`;
        
        // Simulación de encapsulamiento
        setTimeout(() => {
            // Generar valores aleatorios para simular encapsulamiento
            encapsulation = generateRandomEncapsulation(selectedScheme);
            sharedKey = Array.from({length: 32}, () => Math.floor(Math.random() * 256));
            
            // Mostrar encapsulamiento
            encapsulationDisplay.innerHTML = `
                <h4>Datos de Encapsulamiento:</h4>
                <pre>${formatEncapsulation(encapsulation, selectedScheme)}</pre>
            `;
            
            // Mostrar clave compartida (solo para Alice)
            sharedKeyDisplay.innerHTML = `
                <h4>Clave Compartida (Alice):</h4>
                <pre>${formatHex(sharedKey)}</pre>
                <p><em>Esta clave aún no está disponible para Bob.</em></p>
            `;
            
            statusOutput.innerHTML = "Clave encapsulada correctamente.";
            
            // Habilitar botón de desencapsulamiento
            decapsulateBtn.disabled = false;
            attackSimulateBtn.disabled = false;
            
        }, 2000); // Simular tiempo de procesamiento
    }
    
    // Función para simular el desencapsulamiento de clave
    function decapsulateKey() {
        if (!encapsulation) {
            statusOutput.innerHTML = "Error: No hay clave encapsulada para desencapsular.";
            return;
        }
        
        statusOutput.innerHTML = `Desencapsulando clave compartida usando esquema ${getSchemeDisplayName(selectedScheme)}...`;
        
        // Simulación de desencapsulamiento
        setTimeout(() => {
            // Mostrar clave compartida (ahora para Bob también)
            sharedKeyDisplay.innerHTML = `
                <h4>Clave Compartida:</h4>
                <pre>${formatHex(sharedKey)}</pre>
                <p><em>¡Éxito! Alice y Bob ahora comparten la misma clave secreta.</em></p>
            `;
            
            statusOutput.innerHTML = "Clave desencapsulada correctamente. Comunicación segura establecida.";
            
            // Aplicar efecto visual
            sharedKeyDisplay.classList.add('success-highlight');
            setTimeout(() => {
                sharedKeyDisplay.classList.remove('success-highlight');
            }, 2000);
            
        }, 1500); // Simular tiempo de procesamiento
    }
    
    // Función para simular un ataque cuántico
    function simulateAttack() {
        if (!encapsulation) {
            statusOutput.innerHTML = "Error: No hay clave encapsulada para atacar.";
            return;
        }
        
        statusOutput.innerHTML = "Simulando ataque cuántico a la criptografía híbrida...";
        
        // Simulación de ataque
        setTimeout(() => {
            // Resultados del ataque según el esquema
            let classicCompromised = true; // RSA o ECDH siempre comprometidos por ataque cuántico
            let pqcSafe = true; // Los algoritmos PQC permanecen seguros
            
            let attackSuccess = false;
            let attackDescription = "";
            
            switch (selectedScheme) {
                case "serial":
                    attackSuccess = false;
                    attackDescription = "El ataque cuántico compromete el componente RSA, pero el componente ML-KEM permanece seguro. La clave compartida está protegida por ambos componentes en serie, por lo que el atacante no puede recuperar la clave.";
                    break;
                case "parallel":
                    attackSuccess = false;
                    attackDescription = "El ataque cuántico compromete el componente ECDH, pero el componente ML-KEM permanece seguro. La clave compartida es una combinación de ambos componentes, por lo que el atacante solo obtiene información parcial.";
                    break;
                case "integrated":
                    attackSuccess = false;
                    attackDescription = "El ataque cuántico compromete el componente ECDH, pero el componente ML-KEM permanece seguro. La función KDF combina ambos componentes de manera que incluso con uno comprometido, la clave final permanece segura.";
                    break;
            }
            
            // Mostrar resultados del ataque
            attackResultsDisplay.innerHTML = `
                <h4>Resultados del Ataque Cuántico:</h4>
                <div class="attack-result ${attackSuccess ? 'attack-success' : 'attack-failure'}">
                    <p><strong>${attackSuccess ? '⚠️ ATAQUE EXITOSO' : '✅ ATAQUE FALLIDO'}</strong></p>
                    <p>${attackDescription}</p>
                    <ul>
                        <li>Componente clásico: ${classicCompromised ? '❌ Comprometido' : '✅ Seguro'}</li>
                        <li>Componente post-cuántico: ${pqcSafe ? '✅ Seguro' : '❌ Comprometido'}</li>
                        <li>Clave compartida: ${attackSuccess ? '❌ Comprometida' : '✅ Segura'}</li>
                    </ul>
                </div>
            `;
            
            statusOutput.innerHTML = "Simulación de ataque cuántico completada.";
            
        }, 2500); // Simular tiempo de procesamiento
    }
    
    // Funciones auxiliares
    function getSchemeDisplayName(scheme) {
        switch (scheme) {
            case "serial": return "en Serie (RSA + ML-KEM)";
            case "parallel": return "en Paralelo (ECDH + ML-KEM)";
            case "integrated": return "Integrado (ECDH + ML-KEM con KDF)";
            default: return scheme;
        }
    }
    
    function generateRandomKeys(scheme) {
        switch (scheme) {
            case "serial":
                return {
                    rsa: {
                        public: Array.from({length: 8}, () => Math.floor(Math.random() * 256)),
                        private: Array.from({length: 8}, () => Math.floor(Math.random() * 256))
                    },
                    ml_kem: {
                        public: Array.from({length: 8}, () => Math.floor(Math.random() * 256)),
                        private: Array.from({length: 8}, () => Math.floor(Math.random() * 256))
                    }
                };
            case "parallel":
            case "integrated":
                return {
                    ecdh: {
                        public: Array.from({length: 8}, () => Math.floor(Math.random() * 256)),
                        private: Array.from({length: 8}, () => Math.floor(Math.random() * 256))
                    },
                    ml_kem: {
                        public: Array.from({length: 8}, () => Math.floor(Math.random() * 256)),
                        private: Array.from({length: 8}, () => Math.floor(Math.random() * 256))
                    }
                };
            default:
                return {};
        }
    }
    
    function generateRandomEncapsulation(scheme) {
        switch (scheme) {
            case "serial":
                return {
                    rsa: Array.from({length: 16}, () => Math.floor(Math.random() * 256)),
                    ml_kem: Array.from({length: 16}, () => Math.floor(Math.random() * 256))
                };
            case "parallel":
            case "integrated":
                return {
                    ml_kem: Array.from({length: 16}, () => Math.floor(Math.random() * 256))
                };
            default:
                return {};
        }
    }
    
    function formatKeys(keys, scheme) {
        let result = "";
        
        if (scheme === "serial") {
            result += "RSA:\n";
            result += `  Public: ${formatHex(keys.rsa.public)}\n`;
            result += `  Private: ${formatHex(keys.rsa.private)}\n\n`;
            result += "ML-KEM:\n";
            result += `  Public: ${formatHex(keys.ml_kem.public)}\n`;
            result += `  Private: ${formatHex(keys.ml_kem.private)}`;
        } else {
            result += "ECDH:\n";
            result += `  Public: ${formatHex(keys.ecdh.public)}\n`;
            result += `  Private: ${formatHex(keys.ecdh.private)}\n\n`;
            result += "ML-KEM:\n";
            result += `  Public: ${formatHex(keys.ml_kem.public)}\n`;
            result += `  Private: ${formatHex(keys.ml_kem.private)}`;
        }
        
        return result;
    }
    
    function formatEncapsulation(encapsulation, scheme) {
        let result = "";
        
        if (scheme === "serial") {
            result += "RSA Ciphertext: " + formatHex(encapsulation.rsa) + "\n";
            result += "ML-KEM Ciphertext: " + formatHex(encapsulation.ml_kem);
        } else {
            result += "ML-KEM Ciphertext: " + formatHex(encapsulation.ml_kem);
        }
        
        return result;
    }
    
    function formatHex(arr) {
        return arr.map(num => num.toString(16).padStart(2, '0')).join(' ');
    }
    
    // Asignar eventos a botones
    if (generateKeysBtn) generateKeysBtn.addEventListener('click', generateHybridKeys);
    if (encapsulateBtn) encapsulateBtn.addEventListener('click', encapsulateKey);
    if (decapsulateBtn) decapsulateBtn.addEventListener('click', decapsulateKey);
    if (attackSimulateBtn) attackSimulateBtn.addEventListener('click', simulateAttack);
    
    // Inicialmente deshabilitar botones
    if (encapsulateBtn) encapsulateBtn.disabled = true;
    if (decapsulateBtn) decapsulateBtn.disabled = true;
    if (attackSimulateBtn) attackSimulateBtn.disabled = true;
    
    // Añadir estilos dinámicos
    const style = document.createElement('style');
    style.textContent = `
        .success-highlight {
            background-color: rgba(0, 255, 0, 0.2);
            transition: background-color 0.5s;
        }
        .attack-result {
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
        }
        .attack-success {
            background-color: rgba(255, 0, 0, 0.2);
        }
        .attack-failure {
            background-color: rgba(0, 255, 0, 0.2);
        }
    `;
    document.head.appendChild(style);
});
