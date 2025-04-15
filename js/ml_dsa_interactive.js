// Visualización interactiva para el algoritmo ML-DSA
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const generateKeysBtn = document.getElementById('generate-keys-btn');
    const signMessageBtn = document.getElementById('sign-message-btn');
    const verifySignatureBtn = document.getElementById('verify-signature-btn');
    const messageInput = document.getElementById('message-input');
    const statusOutput = document.getElementById('status-output');
    const publicKeyDisplay = document.getElementById('public-key');
    const privateKeyDisplay = document.getElementById('private-key');
    const signatureDisplay = document.getElementById('signature');
    
    // Variables para almacenar claves y firma
    let publicKey = null;
    let privateKey = null;
    let signature = null;
    
    // Función para simular la generación de claves ML-DSA
    function generateKeys() {
        statusOutput.innerHTML = "Generando par de claves ML-DSA...";
        
        // Simulación de generación de claves
        setTimeout(() => {
            // Generar valores aleatorios para simular claves
            privateKey = {
                s: Array.from({length: 8}, () => Math.floor(Math.random() * 256)),
                A: Array.from({length: 8}, () => Math.floor(Math.random() * 256))
            };
            
            publicKey = {
                A: privateKey.A,
                rho: Array.from({length: 8}, () => Math.floor(Math.random() * 256))
            };
            
            // Mostrar claves en formato hexadecimal
            publicKeyDisplay.innerHTML = `A: ${formatHex(publicKey.A)}<br>rho: ${formatHex(publicKey.rho)}`;
            privateKeyDisplay.innerHTML = `s: ${formatHex(privateKey.s)}<br>A: ${formatHex(privateKey.A)}`;
            
            statusOutput.innerHTML = "Par de claves ML-DSA generado correctamente.";
            
            // Habilitar botón de firma
            signMessageBtn.disabled = false;
            verifySignatureBtn.disabled = true;
            signatureDisplay.innerHTML = "";
            
        }, 1500); // Simular tiempo de procesamiento
    }
    
    // Función para simular la firma de un mensaje
    function signMessage() {
        const message = messageInput.value.trim();
        
        if (!message) {
            statusOutput.innerHTML = "Error: Ingrese un mensaje para firmar.";
            return;
        }
        
        if (!privateKey) {
            statusOutput.innerHTML = "Error: Primero debe generar un par de claves.";
            return;
        }
        
        statusOutput.innerHTML = "Firmando mensaje con ML-DSA...";
        
        // Simulación de firma
        setTimeout(() => {
            // Generar valores aleatorios para simular componentes de la firma
            const z = Array.from({length: 8}, () => Math.floor(Math.random() * 256));
            const hints = Array.from({length: 4}, () => Math.floor(Math.random() * 256));
            const c = Array.from({length: 8}, () => Math.floor(Math.random() * 256));
            
            signature = { z, hints, c, message };
            
            // Mostrar firma
            signatureDisplay.innerHTML = `z: ${formatHex(z)}<br>hints: ${formatHex(hints)}<br>c: ${formatHex(c)}`;
            
            statusOutput.innerHTML = "Mensaje firmado correctamente.";
            
            // Habilitar botón de verificación
            verifySignatureBtn.disabled = false;
            
        }, 2000); // Simular tiempo de procesamiento
    }
    
    // Función para simular la verificación de una firma
    function verifySignature() {
        if (!signature) {
            statusOutput.innerHTML = "Error: No hay firma para verificar.";
            return;
        }
        
        if (!publicKey) {
            statusOutput.innerHTML = "Error: No hay clave pública para verificar la firma.";
            return;
        }
        
        const currentMessage = messageInput.value.trim();
        
        statusOutput.innerHTML = "Verificando firma con ML-DSA...";
        
        // Simulación de verificación
        setTimeout(() => {
            // Verificar que el mensaje no ha cambiado
            const isValid = currentMessage === signature.message;
            
            if (isValid) {
                statusOutput.innerHTML = "✅ Firma verificada correctamente. El mensaje es auténtico.";
                signatureDisplay.classList.add('valid-signature');
                setTimeout(() => {
                    signatureDisplay.classList.remove('valid-signature');
                }, 2000);
            } else {
                statusOutput.innerHTML = "❌ Verificación fallida. El mensaje ha sido modificado o la firma es inválida.";
                signatureDisplay.classList.add('invalid-signature');
                setTimeout(() => {
                    signatureDisplay.classList.remove('invalid-signature');
                }, 2000);
            }
            
        }, 1500); // Simular tiempo de procesamiento
    }
    
    // Función auxiliar para formatear arrays como hexadecimal
    function formatHex(arr) {
        return arr.map(num => num.toString(16).padStart(2, '0')).join(' ');
    }
    
    // Asignar eventos a botones
    if (generateKeysBtn) generateKeysBtn.addEventListener('click', generateKeys);
    if (signMessageBtn) signMessageBtn.addEventListener('click', signMessage);
    if (verifySignatureBtn) verifySignatureBtn.addEventListener('click', verifySignature);
    
    // Inicialmente deshabilitar botones de firma y verificación
    if (signMessageBtn) signMessageBtn.disabled = true;
    if (verifySignatureBtn) verifySignatureBtn.disabled = true;
    
    // Añadir estilos dinámicos
    const style = document.createElement('style');
    style.textContent = `
        .valid-signature {
            background-color: rgba(0, 255, 0, 0.2);
            transition: background-color 0.5s;
        }
        .invalid-signature {
            background-color: rgba(255, 0, 0, 0.2);
            transition: background-color 0.5s;
        }
    `;
    document.head.appendChild(style);
});
