window.onload = function () {
    const defaultSection = document.querySelector('.swagger-ui');  //  .info .url
  
    if (defaultSection) {
      defaultSection.innerHTML = `
          <h3>Documentación de la API Web Soldi</h3>
          <p>Esta es la documentación interactiva de la API de ejemplo.</p>
          <p>Explora los endpoints en el menú izquierdo.</p>
          <p>Si tienes alguna pregunta, contacta con nuestro equipo de soporte.</p>
        `;
    }
  };