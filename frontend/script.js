/**
 * Sistema de Registro y Consulta de Estudiantes SINJA
 * Universidad de Antioquia
 * 
 * Funcionalidades principales:
 * - Registro de nuevos estudiantes con validación
 * - Consulta de estudiantes existentes  
 * - Validación en tiempo real de formularios
 * - Integración con API REST de Spring Boot
 */

// ================================
// CONFIGURACIÓN DE LA API
// ================================
const API_BASE_URL = 'http://localhost:8080'; // URL del backend sin /api

// ================================
// VALIDADORES DE CAMPOS
// ================================
const validators = {
    id: (value) => /^\d+$/.test(value) && value.length > 0,
    name: (value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value) && value.trim().length > 0,
    lastName: (value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value) && value.trim().length > 0,
    bornPlace: (value) => value.trim().length > 0,
    degree: (value) => value.trim().length > 0,
    place: (value) => value.trim().length > 0,
    scoreAdmision: (value) => {
        const num = parseInt(value);
        return !isNaN(num) && num >= 0 && num <= 500;
    }
};

// ================================
// FUNCIONES DE NAVEGACIÓN
// ================================

/**
 * Muestra la pantalla principal ocultando todas las otras secciones
 */
function showMainScreen() {
    hideAllSections();
    document.getElementById('mainScreen').classList.add('active');
    resetForm();
}

/**
 * Muestra el formulario de registro
 */
function showRegistroForm() {
    hideAllSections();
    document.getElementById('registroForm').classList.add('active');
}

/**
 * Muestra el modal de consulta
 */
function showConsultaModal() {
    document.getElementById('consultaModal').style.display = 'block';
    document.getElementById('consultaId').focus();
}

/**
 * Cierra el modal de consulta y limpia los resultados
 */
function closeModal() {
    document.getElementById('consultaModal').style.display = 'none';
    document.getElementById('resultadoConsulta').innerHTML = '';
    document.getElementById('consultaId').value = '';
}

/**
 * Oculta todas las secciones de formulario
 */
function hideAllSections() {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => section.classList.remove('active'));
}

// ================================
// VALIDACIÓN DE FORMULARIOS
// ================================

/**
 * Valida un campo individual del formulario
 * @param {HTMLElement} field - El campo a validar
 * @returns {boolean} - True si es válido, false si no
 */
function validateField(field) {
    const fieldName = field.name;
    const value = field.value;
    const formGroup = field.parentNode;
    
    if (validators[fieldName] && !validators[fieldName](value)) {
        formGroup.classList.add('error');
        return false;
    } else {
        formGroup.classList.remove('error');
        return true;
    }
}

/**
 * Valida todo el formulario
 * @returns {boolean} - True si todo el formulario es válido
 */
function validateForm() {
    const form = document.getElementById('personForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// ================================
// MANEJO DE FORMULARIO DE REGISTRO
// ================================

/**
 * Maneja el envío del formulario de registro
 * @param {Event} e - Evento de envío del formulario
 */
async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showAlert('Por favor, corrija los errores en el formulario', 'error');
        return;
    }

    const formData = new FormData(e.target);
    const student = {
        id: parseInt(formData.get('id')),
        name: formData.get('name').trim(),
        lastName: formData.get('lastName').trim(),
        bornPlace: formData.get('bornPlace').trim(),
        degree: formData.get('degree'),
        place: formData.get('place'),
        scoreAdmision: parseInt(formData.get('scoreAdmision'))
    };

    try {
        showLoading(true);
        
        console.log('🔍 Verificando si el estudiante existe...', student.id);
        
        // Verificar si el estudiante ya existe
        const existeResponse = await fetch(`${API_BASE_URL}/search?id=${student.id}`);
        
        console.log('📡 Status de verificación:', existeResponse.status);
        
        if (existeResponse.ok) {
            // Si responde ok, significa que encontró al estudiante
            try {
                const responseText = await existeResponse.text();
                console.log('📄 Respuesta cruda del servidor:', responseText);
                
                if (responseText.trim()) {
                    const existeData = JSON.parse(responseText);
                    console.log('✅ Estudiante encontrado:', existeData);
                } else {
                    console.log('⚠️ Respuesta vacía del servidor');
                }
                
                showAlert('⚠️ El estudiante ya existe en la base de datos', 'error');
                return;
            } catch (parseError) {
                console.log('❌ Error al parsear respuesta:', parseError);
                console.log('📄 Respuesta que causó error:', await existeResponse.text());
                showAlert('⚠️ El estudiante ya existe en la base de datos', 'error');
                return;
            }
        }
        
        // Si responde 404, significa que no existe, entonces podemos registrar
        if (existeResponse.status !== 400) {
            console.log('❌ Error inesperado al verificar:', existeResponse.status);
            throw new Error('Error al verificar el estudiante existente');
        }

        console.log('✅ Estudiante no existe, procediendo con registro...');
        
        // Si no existe (404), proceder con el registro
        const response = await fetch(`${API_BASE_URL}/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(student)
        });

        console.log('💾 Status del registro:', response.status);

        if (response.ok) {
            try {
                const responseText = await response.text();
                console.log('📄 Respuesta del registro:', responseText);
                
                if (responseText.trim()) {
                    const savedData = JSON.parse(responseText);
                    console.log('✅ Estudiante registrado:', savedData);
                } else {
                    console.log('⚠️ Registro exitoso pero respuesta vacía');
                }
                
                showAlert('✅ Registro exitoso', 'success');
                resetForm();
                setTimeout(() => {
                    showMainScreen();
                }, 2000);
            } catch (parseError) {
                console.log('❌ Error al parsear respuesta del registro:', parseError);
                showAlert('✅ Registro exitoso', 'success');
                resetForm();
                setTimeout(() => {
                    showMainScreen();
                }, 2000);
            }
        } else {
            const errorText = await response.text();
            console.log('❌ Error del servidor:', errorText);
            throw new Error(`Error al registrar el estudiante: ${response.status}`);
        }

    } catch (error) {
        console.error('❌ Error completo:', error);
        
        // Verificar si es un error de conexión
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showAlert('❌ No se puede conectar al servidor. ¿Está corriendo Spring Boot en puerto 8080?', 'error');
        } else {
            showAlert(`❌ Error: ${error.message}`, 'error');
        }
    } finally {
        showLoading(false);
    }
}

// ================================
// BÚSQUEDA DE ESTUDIANTES
// ================================

/**
 * Busca un estudiante por ID
 */
async function buscarPersona() {
    const id = document.getElementById('consultaId').value.trim();
    
    if (!id || !validators.id(id)) {
        showAlert('Por favor, ingrese un ID válido (solo números)', 'error');
        return;
    }

    try {
        showConsultaLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/search?id=${id}`);
        
        if (response.ok) {
            const student = await response.json();
            mostrarResultadoConsulta(student);
        } else if (response.status === 404) {
            mostrarResultadoConsulta(null);
        } else {
            throw new Error('Error al consultar el estudiante');
        }

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('resultadoConsulta').innerHTML = `
            <div class="error-alert">
                ❌ Error al realizar la consulta. Verifique la conexión con el servidor.
            </div>
        `;
    } finally {
        showConsultaLoading(false);
    }
}

/**
 * Muestra el resultado de la consulta en el modal
 * @param {Object|null} student - Los datos del estudiante encontrado o null
 */
function mostrarResultadoConsulta(student) {
    const resultadoDiv = document.getElementById('resultadoConsulta');
    
    if (!student) {
        resultadoDiv.innerHTML = `
            <div class="error-alert">
                ❌ No se encontró ningún estudiante con el ID especificado
            </div>
        `;
        return;
    }

    resultadoDiv.innerHTML = `
        <div class="result-card">
            <h4>✅ Estudiante Encontrado</h4>
            <div class="result-item">
                <strong>ID:</strong> ${student.id}
            </div>
            <div class="result-item">
                <strong>Nombre:</strong> ${student.name}
            </div>
            <div class="result-item">
                <strong>Apellido:</strong> ${student.lastName}
            </div>
            <div class="result-item">
                <strong>Lugar de Nacimiento:</strong> ${student.bornPlace}
            </div>
            <div class="result-item">
                <strong>Carrera:</strong> ${student.degree}
            </div>
            <div class="result-item">
                <strong>Campus:</strong> ${student.place}
            </div>
            <div class="result-item">
                <strong>Puntaje de Admisión:</strong> ${student.scoreAdmision}
            </div>
        </div>
    `;
}

// ================================
// FUNCIONES AUXILIARES
// ================================

/**
 * Muestra u oculta el indicador de carga del formulario principal
 * @param {boolean} show - True para mostrar, false para ocultar
 */
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

/**
 * Muestra u oculta el indicador de carga del modal de consulta
 * @param {boolean} show - True para mostrar, false para ocultar
 */
function showConsultaLoading(show) {
    document.getElementById('consultaLoading').style.display = show ? 'block' : 'none';
}

/**
 * Muestra una alerta temporal en el formulario de registro
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de alerta ('success' o 'error')
 */
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = type === 'success' ? 'success-message' : 'error-alert';
    alertDiv.innerHTML = message;
    
    const form = document.getElementById('registroForm');
    form.insertBefore(alertDiv, form.querySelector('form'));
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

/**
 * Resetea el formulario a su estado inicial
 */
function resetForm() {
    const form = document.getElementById('personForm');
    form.reset();
    
    // Remover clases de error
    const errorGroups = form.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => group.classList.remove('error'));
    
    // Remover mensajes de alerta
    const alerts = document.querySelectorAll('.success-message, .error-alert');
    alerts.forEach(alert => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    });
}

// Función para eliminar estudiante
async function eliminarEstudiante(id) {
    if (!confirm('¿Está seguro de que desea eliminar este estudiante?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/delete?id=${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showAlert('✅ Estudiante eliminado exitosamente', 'success');
            closeModal();
        } else {
            throw new Error('Error al eliminar el estudiante');
        }

    } catch (error) {
        console.error('Error:', error);
        showAlert('❌ Error al eliminar el estudiante', 'error');
    }
}

// ================================
// INICIALIZACIÓN DEL DOM
// ================================

/**
 * Inicializa los event listeners cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
    // Configurar el manejador del formulario
    const form = document.getElementById('personForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
    
    // Configurar validación en tiempo real
    const inputs = document.querySelectorAll('#personForm input, #personForm select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remover error mientras el usuario escribe
            const formGroup = this.parentNode;
            formGroup.classList.remove('error');
        });
    });
    
    // Configurar evento Enter en el campo de consulta
    const consultaInput = document.getElementById('consultaId');
    if (consultaInput) {
        consultaInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                buscarPersona();
            }
        });
    }
    
    // Cerrar modal al hacer clic fuera de él
    const modal = document.getElementById('consultaModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});
