document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const input = document.getElementById('qr-input');
    const errorElement = document.getElementById('error-message');
    const qrContainer = document.getElementById('qr-result');
    const qrImage = document.getElementById('qr-image');
    const downloadBtn = document.getElementById('download-btn');

    generateBtn.addEventListener('click', generateQR);

    function generateQR() {
        const inputValue = input.value.trim();
        
        // Validación
        if (!inputValue) {
            showError('Por favor ingresa una URL o texto');
            return;
        }
        
        // Limpiar errores
        clearError();
        
        // Procesar URL
        const processedInput = processInput(inputValue);
        
        // Generar y mostrar QR
        generateQRCode(processedInput);
    }

    function processInput(rawInput) {
        if (!rawInput.startsWith('http://') && 
            !rawInput.startsWith('https://') && 
            !rawInput.startsWith('mailto:') && 
            !rawInput.startsWith('tel:')) {
            return 'https://' + rawInput;
        }
        return rawInput;
    }

    function generateQRCode(data) {
        const encodedInput = encodeURIComponent(data);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedInput}&format=png&margin=10&t=${Date.now()}`;
        
        qrImage.src = qrUrl;
        qrContainer.style.display = 'block';
        
        setupDownload(qrUrl);
    }

    function setupDownload(qrUrl) {
        fetch(qrUrl)
            .then(response => {
                if (!response.ok) throw new Error('Error en la red');
                return response.blob();
            })
            .then(blob => {
                const downloadUrl = URL.createObjectURL(blob);
                downloadBtn.href = downloadUrl;
                downloadBtn.onclick = () => {
                    setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
                };
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Error al generar el QR. Intenta nuevamente.');
            });
    }

    function showError(message) {
        errorElement.textContent = message;
        qrContainer.style.display = 'none';
    }

    function clearError() {
        errorElement.textContent = '';
    }
});