// Visualización interactiva para QKD (BB84)
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const startSimulationBtn = document.getElementById('start-qkd-btn');
    const resetSimulationBtn = document.getElementById('reset-qkd-btn');
    const nextStepBtn = document.getElementById('next-step-btn');
    const qkdStatusOutput = document.getElementById('qkd-status-output');
    const aliceDisplay = document.getElementById('alice-display');
    const bobDisplay = document.getElementById('bob-display');
    const quantumChannelDisplay = document.getElementById('quantum-channel-display');
    const classicalChannelDisplay = document.getElementById('classical-channel-display');
    const finalKeyDisplay = document.getElementById('final-key-display');
    const eveCheckbox = document.getElementById('eve-checkbox');
    
    // Variables de simulación
    let currentStep = 0;
    let simulationActive = false;
    let withEve = false;
    
    // Datos de simulación
    let aliceBits = [];
    let aliceBases = [];
    let bobBases = [];
    let bobResults = [];
    let matchingIndices = [];
    let sampleIndices = [];
    let finalKeyIndices = [];
    let finalKey = [];
    let eveBases = [];
    let eveResults = [];
    let errorRate = 0;
    
    // Constantes
    const NUM_BITS = 16;
    const SAMPLE_SIZE = 4;
    const FINAL_KEY_SIZE = 4;
    
    // Función para iniciar la simulación
    function startSimulation() {
        // Reiniciar variables
        currentStep = 0;
        simulationActive = true;
        withEve = eveCheckbox.checked;
        
        // Generar datos aleatorios
        generateRandomData();
        
        // Actualizar interfaz
        updateInterface();
        
        // Habilitar/deshabilitar botones
        startSimulationBtn.disabled = true;
        resetSimulationBtn.disabled = false;
        nextStepBtn.disabled = false;
        eveCheckbox.disabled = true;
        
        qkdStatusOutput.innerHTML = "Simulación iniciada. Presione 'Siguiente Paso' para continuar.";
    }
    
    // Función para reiniciar la simulación
    function resetSimulation() {
        // Reiniciar variables
        currentStep = 0;
        simulationActive = false;
        
        // Limpiar displays
        aliceDisplay.innerHTML = "";
        bobDisplay.innerHTML = "";
        quantumChannelDisplay.innerHTML = "";
        classicalChannelDisplay.innerHTML = "";
        finalKeyDisplay.innerHTML = "";
        
        // Habilitar/deshabilitar botones
        startSimulationBtn.disabled = false;
        resetSimulationBtn.disabled = true;
        nextStepBtn.disabled = true;
        eveCheckbox.disabled = false;
        
        qkdStatusOutput.innerHTML = "Simulación reiniciada. Presione 'Iniciar Simulación' para comenzar.";
    }
    
    // Función para avanzar al siguiente paso
    function nextStep() {
        if (!simulationActive) return;
        
        currentStep++;
        updateInterface();
        
        // Verificar si hemos llegado al final
        if (currentStep >= 5) {
            nextStepBtn.disabled = true;
            qkdStatusOutput.innerHTML = "Simulación completada.";
        }
    }
    
    // Función para generar datos aleatorios
    function generateRandomData() {
        // Bits y bases de Alice
        aliceBits = Array.from({length: NUM_BITS}, () => Math.floor(Math.random() * 2));
        aliceBases = Array.from({length: NUM_BITS}, () => Math.floor(Math.random() * 2));
        
        // Bases de Bob
        bobBases = Array.from({length: NUM_BITS}, () => Math.floor(Math.random() * 2));
        
        // Bases de Eve (si está activa)
        if (withEve) {
            eveBases = Array.from({length: NUM_BITS}, () => Math.floor(Math.random() * 2));
        }
        
        // Calcular resultados de Bob (y Eve si está activa)
        calculateResults();
        
        // Calcular índices coincidentes
        matchingIndices = [];
        for (let i = 0; i < NUM_BITS; i++) {
            if (aliceBases[i] === bobBases[i]) {
                matchingIndices.push(i);
            }
        }
        
        // Seleccionar índices para verificación
        sampleIndices = [];
        if (matchingIndices.length > SAMPLE_SIZE) {
            // Seleccionar aleatoriamente SAMPLE_SIZE índices
            const shuffled = [...matchingIndices].sort(() => 0.5 - Math.random());
            sampleIndices = shuffled.slice(0, SAMPLE_SIZE);
        }
        
        // Calcular tasa de error
        let errors = 0;
        for (let i of sampleIndices) {
            if (aliceBits[i] !== bobResults[i]) {
                errors++;
            }
        }
        errorRate = errors / sampleIndices.length;
        
        // Seleccionar índices para la clave final
        const remainingIndices = matchingIndices.filter(i => !sampleIndices.includes(i));
        finalKeyIndices = [];
        if (remainingIndices.length > 0) {
            // Seleccionar aleatoriamente hasta FINAL_KEY_SIZE índices
            const size = Math.min(FINAL_KEY_SIZE, remainingIndices.length);
            const shuffled = [...remainingIndices].sort(() => 0.5 - Math.random());
            finalKeyIndices = shuffled.slice(0, size);
        }
        
        // Extraer clave final
        finalKey = finalKeyIndices.map(i => aliceBits[i]);
    }
    
    // Función para calcular resultados de mediciones
    function calculateResults() {
        bobResults = [];
        eveResults = [];
        
        for (let i = 0; i < NUM_BITS; i++) {
            if (withEve) {
                // Eve intercepta y mide
                let eveResult;
                if (eveBases[i] === aliceBases[i]) {
                    // Eve usa la misma base que Alice -> resultado determinista
                    eveResult = aliceBits[i];
                } else {
                    // Eve usa base diferente -> resultado aleatorio
                    eveResult = Math.floor(Math.random() * 2);
                }
                eveResults.push(eveResult);
                
                // Eve reenvía según su medición
                let bobResult;
                if (bobBases[i] === eveBases[i]) {
                    // Bob usa la misma base que Eve -> resultado determinista
                    bobResult = eveResult;
                } else {
                    // Bob usa base diferente -> resultado aleatorio
                    bobResult = Math.floor(Math.random() * 2);
                }
                bobResults.push(bobResult);
            } else {
                // Sin Eve
                let bobResult;
                if (bobBases[i] === aliceBases[i]) {
                    // Bob usa la misma base que Alice -> resultado determinista
                    bobResult = aliceBits[i];
                } else {
                    // Bob usa base diferente -> resultado aleatorio
                    bobResult = Math.floor(Math.random() * 2);
                }
                bobResults.push(bobResult);
            }
        }
    }
    
    // Función para actualizar la interfaz según el paso actual
    function updateInterface() {
        switch (currentStep) {
            case 0: // Estado inicial
                showInitialState();
                break;
            case 1: // Alice prepara y envía qubits
                showAlicePreparation();
                break;
            case 2: // Bob mide qubits
                showBobMeasurement();
                break;
            case 3: // Reconciliación de bases
                showBaseReconciliation();
                break;
            case 4: // Estimación de error
                showErrorEstimation();
                break;
            case 5: // Clave final
                showFinalKey();
                break;
        }
    }
    
    // Funciones para mostrar cada paso
    function showInitialState() {
        aliceDisplay.innerHTML = `
            <h4>Alice</h4>
            <p>Preparada para generar bits aleatorios y seleccionar bases de medición.</p>
        `;
        
        bobDisplay.innerHTML = `
            <h4>Bob</h4>
            <p>Preparado para seleccionar bases de medición aleatorias.</p>
        `;
        
        if (withEve) {
            quantumChannelDisplay.innerHTML = `
                <h4>Canal Cuántico (con Eve)</h4>
                <p>Eve está esperando para interceptar la comunicación.</p>
            `;
        } else {
            quantumChannelDisplay.innerHTML = `
                <h4>Canal Cuántico</h4>
                <p>Canal listo para transmitir qubits.</p>
            `;
        }
        
        classicalChannelDisplay.innerHTML = `
            <h4>Canal Clásico</h4>
            <p>Canal listo para comunicación pública.</p>
        `;
        
        finalKeyDisplay.innerHTML = `
            <h4>Clave Final</h4>
            <p>Pendiente de generación.</p>
        `;
    }
    
    function showAlicePreparation() {
        // Mostrar bits y bases de Alice
        let aliceContent = `<h4>Alice</h4><p>Bits aleatorios generados y codificados en qubits:</p>`;
        aliceContent += `<div class="qkd-bits-container">`;
        
        for (let i = 0; i < NUM_BITS; i++) {
            const bit = aliceBits[i];
            const basis = aliceBases[i];
            const basisSymbol = basis === 0 ? '+' : '×';
            
            aliceContent += `
                <div class="qkd-bit">
                    <div class="bit-value">${bit}</div>
                    <div class="bit-basis">${basisSymbol}</div>
                </div>
            `;
        }
        
        aliceContent += `</div>`;
        aliceDisplay.innerHTML = aliceContent;
        
        // Mostrar canal cuántico con qubits en tránsito
        let channelContent = `<h4>Canal Cuántico</h4><p>Qubits en tránsito:</p>`;
        channelContent += `<div class="qkd-channel">`;
        
        for (let i = 0; i < NUM_BITS; i++) {
            const bit = aliceBits[i];
            const basis = aliceBases[i];
            const basisSymbol = basis === 0 ? '+' : '×';
            
            channelContent += `
                <div class="qkd-qubit">
                    <div class="qubit-symbol">${bit}${basisSymbol}</div>
                </div>
            `;
        }
        
        channelContent += `</div>`;
        
        if (withEve) {
            channelContent += `<p class="warning">⚠️ Eve está interceptando los qubits.</p>`;
        }
        
        quantumChannelDisplay.innerHTML = channelContent;
        
        // Actualizar Bob
        bobDisplay.innerHTML = `
            <h4>Bob</h4>
            <p>Esperando recibir qubits...</p>
        `;
        
        qkdStatusOutput.innerHTML = "Paso 1: Alice ha preparado qubits y los está enviando a través del canal cuántico.";
    }
    
    function showBobMeasurement() {
        // Mostrar bases y resultados de Bob
        let bobContent = `<h4>Bob</h4><p>Bases seleccionadas aleatoriamente y resultados de medición:</p>`;
        bobContent += `<div class="qkd-bits-container">`;
        
        for (let i = 0; i < NUM_BITS; i++) {
            const result = bobResults[i];
            const basis = bobBases[i];
            const basisSymbol = basis === 0 ? '+' : '×';
            
            bobContent += `
                <div class="qkd-bit">
                    <div class="bit-value">${result}</div>
                    <div class="bit-basis">${basisSymbol}</div>
                </div>
            `;
        }
        
        bobContent += `</div>`;
        bobDisplay.innerHTML = bobContent;
        
        // Actualizar canal cuántico
        quantumChannelDisplay.innerHTML = `
            <h4>Canal Cuántico</h4>
            <p>Todos los qubits han sido transmitidos y medidos.</p>
        `;
        
        if (withEve) {
            // Mostrar lo que Eve obtuvo
            let eveContent = `<h4>Eve (Espía)</h4><p>Bases seleccionadas y resultados obtenidos:</p>`;
            eveContent += `<div class="qkd-bits-container">`;
            
            for (let i = 0; i < NUM_BITS; i++) {
                const result = eveResults[i];
                const basis = eveBases[i];
                const basisSymbol = basis === 0 ? '+' : '×';
                
                eveContent += `
                    <div class="qkd-bit">
                        <div class="bit-value">${result}</div>
                        <div class="bit-basis">${basisSymbol}</div>
                    </div>
                `;
            }
            
            eveContent += `</div>`;
            quantumChannelDisplay.innerHTML += eveContent;
        }
        
        qkdStatusOutput.innerHTML = "Paso 2: Bob ha medido los qubits recibidos usando bases aleatorias.";
    }
    
    function showBaseReconciliation() {
        // Mostrar comunicación de bases
        let classicalContent = `<h4>Canal Clásico</h4><p>Alice y Bob comparten públicamente sus bases:</p>`;
        classicalContent += `
            <div class="qkd-classical-channel">
                <div class="alice-bases">
                    <p>Bases de Alice:</p>
                    <div class="bases-list">${aliceBases.map(b => b === 0 ? '+' : '×').join(' ')}</div>
                </div>
                <div class="bob-bases">
                    <p>Bases de Bob:</p>
                    <div class="bases-list">${bobBases.map(b => b === 0 ? '+' : '×').join(' ')}</div>
                </div>
            </div>
        `;
        
        // Mostrar coincidencias
        classicalContent += `<p>Posiciones donde las bases coinciden (${matchingIndices.length}/${NUM_BITS}):</p>`;
        classicalContent += `<div class="matching-indices">`;
        
        for (let i = 0; i < NUM_BITS; i++) {
            const isMatching = matchingIndices.includes(i);
            classicalContent += `<span class="index ${isMatching ? 'matching' : 'non-matching'}">${i}</span>`;
        }
        
        classicalContent += `</div>`;
        classicalChannelDisplay.innerHTML = classicalContent;
        
        // Actualizar displays de Alice y Bob para mostrar bits coincidentes
        updateAliceDisplayWithMatching();
        updateBobDisplayWithMatching();
        
        qkdStatusOutput.innerHTML = `Paso 3: Alice y Bob han comparado sus bases y encontrado ${matchingIndices.length} coincidencias.`;
    }
    
    function showErrorEstimation() {
        // Mostrar comunicación para estimación de error
        let classicalContent = `<h4>Canal Clásico</h4><p>Alice y Bob comparten algunos bits para estimar errores:</p>`;
        
        // Mostrar bits seleccionados para verificación
        classicalContent += `<p>Posiciones seleccionadas para verificación (${sampleIndices.length} bits):</p>`;
        classicalContent += `<div class="sample-indices">`;
        
        for (let i = 0; i < NUM_BITS; i++) {
            let className = "index";
            if (matchingIndices.includes(i)) {
                className += " matching";
                if (sampleIndices.includes(i)) {
                    className += " sample";
                }
            } else {
                className += " non-matching";
            }
            
            classicalContent += `<span class="${className}">${i}</span>`;
        }
        
        classicalContent += `</div>`;
        
        // Mostrar comparación de bits
        classicalContent += `<div class="error-estimation">`;
        classicalContent += `<p>Comparación de bits:</p>`;
        classicalContent += `<table class="error-table">`;
        classicalContent += `<tr><th>Posición</th><th>Bit de Alice</th><th>Bit de Bob</th><th>Resultado</th></tr>`;
        
        let errors = 0;
        for (let i of sampleIndices) {
            const aliceBit = aliceBits[i];
            const bobBit = bobResults[i];
            const match = aliceBit === bobBit;
            if (!match) errors++;
            
            classicalContent += `
                <tr>
                    <td>${i}</td>
                    <td>${aliceBit}</td>
                    <td>${bobBit}</td>
                    <td class="${match ? 'match' : 'error'}">${match ? '✓' : '✗'}</td>
                </tr>
            `;
        }
        
        classicalContent += `</table>`;
        classicalContent += `<p>Tasa de error: ${errors}/${sampleIndices.length} = ${(errorRate * 100).toFixed(1)}%</p>`;
        
        if (withEve && errorRate > 0) {
            classicalContent += `<p class="warning">⚠️ La alta tasa de error indica la posible presencia de un espía.</p>`;
        }
        
        classicalContent += `</div>`;
        classicalChannelDisplay.innerHTML = classicalContent;
        
        // Actualizar displays de Alice y Bob
        updateAliceDisplayWithSampling();
        updateBobDisplayWithSampling();
        
        qkdStatusOutput.innerHTML = `Paso 4: Alice y Bob han estimado una tasa de error del ${(errorRate * 100).toFixed(1)}%.`;
    }
    
    function showFinalKey() {
        // Mostrar clave final
        let finalKeyContent = `<h4>Clave Final</h4>`;
        
        if (withEve && errorRate > 0.15) {
            finalKeyContent += `
                <div class="key-error">
                    <p>⚠️ La tasa de error es demasiado alta (${(errorRate * 100).toFixed(1)}%).</p>
                    <p>Alice y Bob abortan el protocolo por sospecha de espionaje.</p>
                </div>
            `;
        } else {
            finalKeyContent += `<p>Bits seleccionados para la clave final (${finalKeyIndices.length} bits):</p>`;
            finalKeyContent += `<div class="final-indices">`;
            
            for (let i = 0; i < NUM_BITS; i++) {
                let className = "index";
                if (matchingIndices.includes(i)) {
                    className += " matching";
                    if (sampleIndices.includes(i)) {
                        className += " sample";
                    } else if (finalKeyIndices.includes(i)) {
                        className += " final";
                    }
                } else {
                    className += " non-matching";
                }
                
                finalKeyContent += `<span class="${className}">${i}</span>`;
            }
            
            finalKeyContent += `</div>`;
            
            // Mostrar la clave final
            finalKeyContent += `<div class="final-key">`;
            finalKeyContent += `<p>Clave compartida:</p>`;
            finalKeyContent += `<div class="key-bits">`;
            
            for (let bit of finalKey) {
                finalKeyContent += `<span class="key-bit">${bit}</span>`;
            }
            
            finalKeyContent += `</div>`;
            finalKeyContent += `<p>Clave en binario: ${finalKey.join('')}</p>`;
            
            // Convertir a hexadecimal para mostrar
            const keyHex = parseInt(finalKey.join(''), 2).toString(16).padStart(Math.ceil(finalKey.length / 4), '0');
            finalKeyContent += `<p>Clave en hexadecimal: 0x${keyHex}</p>`;
            
            finalKeyContent += `</div>`;
        }
        
        finalKeyDisplay.innerHTML = finalKeyContent;
        
        // Actualizar displays de Alice y Bob
        updateAliceDisplayWithFinal();
        updateBobDisplayWithFinal();
        
        if (withEve && errorRate > 0.15) {
            qkdStatusOutput.innerHTML = "Paso 5: Protocolo abortado debido a la alta tasa de error.";
        } else {
            qkdStatusOutput.innerHTML = `Paso 5: Alice y Bob han establecido una clave compartida de ${finalKey.length} bits.`;
        }
    }
    
    // Funciones auxiliares para actualizar displays
    function updateAliceDisplayWithMatching() {
        let aliceContent = `<h4>Alice</h4><p>Bits y bases (resaltando coincidencias):</p>`;
        aliceContent += `<div class="qkd-bits-container">`;
        
        for (let i = 0; i < NUM_BITS; i++) {
            const bit = aliceBits[i];
            const basis = aliceBases[i];
            const basisSymbol = basis === 0 ? '+' : '×';
            const isMatching = matchingIndices.includes(i);
            
            aliceContent += `
                <div class="qkd-bit ${isMatching ? 'matching-basis' : ''}">
                    <div class="bit-value">${bit}</div>
                    <div class="bit-basis">${basisSymbol}</div>
                </div>
            `;
        }
        
        aliceContent += `</div>`;
        aliceDisplay.innerHTML = aliceContent;
    }
    
    function updateBobDisplayWithMatching() {
        let bobContent = `<h4>Bob</h4><p>Bits y bases (resaltando coincidencias):</p>`;
        bobContent += `<div class="qkd-bits-container">`;
        
        for (let i = 0; i < NUM_BITS; i++) {
            const result = bobResults[i];
            const basis = bobBases[i];
            const basisSymbol = basis === 0 ? '+' : '×';
            const isMatching = matchingIndices.includes(i);
            
            bobContent += `
                <div class="qkd-bit ${isMatching ? 'matching-basis' : ''}">
                    <div class="bit-value">${result}</div>
                    <div class="bit-basis">${basisSymbol}</div>
                </div>
            `;
        }
        
        bobContent += `</div>`;
        bobDisplay.innerHTML = bobContent;
    }
    
    function updateAliceDisplayWithSampling() {
        let aliceContent = `<h4>Alice</h4><p>Bits y bases (resaltando verificación):</p>`;
        aliceContent += `<div class="qkd-bits-container">`;
        
        for (let i = 0; i < NUM_BITS; i++) {
            const bit = aliceBits[i];
            const basis = aliceBases[i];
            const basisSymbol = basis === 0 ? '+' : '×';
            
            let className = "qkd-bit";
            if (matchingIndices.includes(i)) {
                className += " matching-basis";
                if (sampleIndices.includes(i)) {
                    className += " sample-bit";
                }
            }
            
            aliceContent += `
                <div class="${className}">
                    <div class="bit-value">${bit}</div>
                    <div class="bit-basis">${basisSymbol}</div>
                </div>
            `;
        }
        
        aliceContent += `</div>`;
        aliceDisplay.innerHTML = aliceContent;
    }
    
    function updateBobDisplayWithSampling() {
        let bobContent = `<h4>Bob</h4><p>Bits y bases (resaltando verificación):</p>`;
        bobContent += `<div class="qkd-bits-container">`;
        
        for (let i = 0; i < NUM_BITS; i++) {
            const result = bobResults[i];
            const basis = bobBases[i];
            const basisSymbol = basis === 0 ? '+' : '×';
            
            let className = "qkd-bit";
            if (matchingIndices.includes(i)) {
                className += " matching-basis";
                if (sampleIndices.includes(i)) {
                    className += " sample-bit";
                    if (aliceBits[i] !== result) {
                        className += " error-bit";
                    }
                }
            }
            
            bobContent += `
                <div class="${className}">
                    <div class="bit-value">${result}</div>
                    <div class="bit-basis">${basisSymbol}</div>
                </div>
            `;
        }
        
        bobContent += `</div>`;
        bobDisplay.innerHTML = bobContent;
    }
    
    function updateAliceDisplayWithFinal() {
        let aliceContent = `<h4>Alice</h4><p>Bits y bases (resaltando clave final):</p>`;
        aliceContent += `<div class="qkd-bits-container">`;
        
        for (let i = 0; i < NUM_BITS; i++) {
            const bit = aliceBits[i];
            const basis = aliceBases[i];
            const basisSymbol = basis === 0 ? '+' : '×';
            
            let className = "qkd-bit";
            if (matchingIndices.includes(i)) {
                className += " matching-basis";
                if (sampleIndices.includes(i)) {
                    className += " sample-bit";
                } else if (finalKeyIndices.includes(i)) {
                    className += " final-key-bit";
                }
            }
            
            aliceContent += `
                <div class="${className}">
                    <div class="bit-value">${bit}</div>
                    <div class="bit-basis">${basisSymbol}</div>
                </div>
            `;
        }
        
        aliceContent += `</div>`;
        aliceDisplay.innerHTML = aliceContent;
    }
    
    function updateBobDisplayWithFinal() {
        let bobContent = `<h4>Bob</h4><p>Bits y bases (resaltando clave final):</p>`;
        bobContent += `<div class="qkd-bits-container">`;
        
        for (let i = 0; i < NUM_BITS; i++) {
            const result = bobResults[i];
            const basis = bobBases[i];
            const basisSymbol = basis === 0 ? '+' : '×';
            
            let className = "qkd-bit";
            if (matchingIndices.includes(i)) {
                className += " matching-basis";
                if (sampleIndices.includes(i)) {
                    className += " sample-bit";
                    if (aliceBits[i] !== result) {
                        className += " error-bit";
                    }
                } else if (finalKeyIndices.includes(i)) {
                    className += " final-key-bit";
                }
            }
            
            bobContent += `
                <div class="${className}">
                    <div class="bit-value">${result}</div>
                    <div class="bit-basis">${basisSymbol}</div>
                </div>
            `;
        }
        
        bobContent += `</div>`;
        bobDisplay.innerHTML = bobContent;
    }
    
    // Asignar eventos a botones
    if (startSimulationBtn) startSimulationBtn.addEventListener('click', startSimulation);
    if (resetSimulationBtn) resetSimulationBtn.addEventListener('click', resetSimulation);
    if (nextStepBtn) nextStepBtn.addEventListener('click', nextStep);
    
    // Inicialmente deshabilitar botones
    if (resetSimulationBtn) resetSimulationBtn.disabled = true;
    if (nextStepBtn) nextStepBtn.disabled = true;
    
    // Añadir estilos dinámicos
    const style = document.createElement('style');
    style.textContent = `
        .qkd-bits-container {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin: 10px 0;
        }
        
        .qkd-bit {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 30px;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 2px;
        }
        
        .bit-value {
            font-weight: bold;
        }
        
        .bit-basis {
            font-size: 0.8em;
            color: #666;
        }
        
        .qkd-channel {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin: 10px 0;
            padding: 5px;
            background-color: #f0f8ff;
            border-radius: 4px;
        }
        
        .qkd-qubit {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            border: 1px dashed #999;
            border-radius: 50%;
        }
        
        .matching-basis {
            background-color: rgba(144, 238, 144, 0.3);
            border-color: #4CAF50;
        }
        
        .sample-bit {
            background-color: rgba(255, 235, 59, 0.3);
            border-color: #FFC107;
        }
        
        .error-bit {
            background-color: rgba(255, 99, 71, 0.3);
            border-color: #F44336;
        }
        
        .final-key-bit {
            background-color: rgba(0, 191, 255, 0.3);
            border-color: #2196F3;
        }
        
        .index {
            display: inline-block;
            width: 20px;
            height: 20px;
            text-align: center;
            margin: 2px;
            border-radius: 3px;
            font-size: 0.8em;
        }
        
        .matching {
            background-color: rgba(144, 238, 144, 0.3);
        }
        
        .non-matching {
            background-color: rgba(211, 211, 211, 0.3);
        }
        
        .sample {
            background-color: rgba(255, 235, 59, 0.3);
        }
        
        .final {
            background-color: rgba(0, 191, 255, 0.3);
        }
        
        .error-table {
            border-collapse: collapse;
            margin: 10px 0;
        }
        
        .error-table th, .error-table td {
            border: 1px solid #ddd;
            padding: 4px 8px;
            text-align: center;
        }
        
        .match {
            color: green;
        }
        
        .error {
            color: red;
        }
        
        .key-bit {
            display: inline-block;
            width: 25px;
            height: 25px;
            text-align: center;
            line-height: 25px;
            margin: 2px;
            background-color: rgba(0, 191, 255, 0.3);
            border: 1px solid #2196F3;
            border-radius: 3px;
            font-weight: bold;
        }
        
        .warning {
            color: red;
            font-weight: bold;
        }
        
        .key-error {
            background-color: rgba(255, 99, 71, 0.2);
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #F44336;
        }
    `;
    document.head.appendChild(style);
    
    // Inicializar la interfaz
    resetSimulation();
});
