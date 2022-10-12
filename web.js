document.addEventListener("DOMContentLoaded", () => {
  //el navegador HTML está completamente cargado y el árbol DOM está construido, pero es posible que los recursos externos como <img> y hojas de estilo aún no se hayan cargado.

  async function fetchProductos(){
    const response = await fetch('./Productos.json')
    return await response.json()
  }
  
  let baseDeDatos = [];

  fetchProductos().then(productos => {
    baseDeDatos = productos
    renderizarProductos()
  })




  swal("Bienvenido al E-Commerce de Ricardo!");

  let carrito = [];
  const divisa = "$";
  const DOMitems = document.querySelector("#items");
  const DOMcarrito = document.querySelector("#carrito");
  const DOMtotal = document.querySelector("#total");
  const DOMbotonVaciar = document.querySelector("#boton-vaciar");



  // funciones
 //esto se puede hacer tambien con un template xd
  function renderizarProductos() {
    baseDeDatos.forEach((info) => {
      //aqui creamos el card
      //estructura
      const miNodo = document.createElement("div");
      miNodo.classList.add("card", "col-sm-3");//le añadimos una clase de bootstrap 'card' y 'col-sm-4'

      // body
      const miNodoBody = document.createElement("div");
      miNodoBody.classList.add("card-body"); //agregamos una clase de bootstrap

      // titulo
      const miNodoTitulo = document.createElement("h5");
      miNodoTitulo.classList.add("card-title");  //agregamos una clase de bootstrap
      miNodoTitulo.textContent = info.nombre;    //info es la variable del foreach y nombre es el atributo del objeto.

      // imagen
      const miNodoImagen = document.createElement("img");
      miNodoImagen.classList.add("img-fluid"); //agregamos una clase de bootstrap
      miNodoImagen.setAttribute("src", info.imagen); //info es la variable del foreach y Imagen es el atributo del objeto.

      // descripcion
      const miNodoDescripcion = document.createElement("p");
      miNodoDescripcion.classList.add("descripcion");
      miNodoDescripcion.textContent = `${info.descripcion}`; //divisa es el signo de '$'

      //precio
      const miNodoPrecio = document.createElement("p");
      miNodoPrecio.classList.add("card-text");
      miNodoPrecio.textContent = `${info.precio}${divisa}`;

      //boton
      const miNodoBoton = document.createElement("button");
      miNodoBoton.classList.add("btn", "btn-primary");
      miNodoBoton.textContent = "Agregar a carrito +"; // es el signo de agregar a carrito
      miNodoBoton.setAttribute("marcador", info.id);
      miNodoBoton.addEventListener("click", añadirProductoAlCarrito);
      miNodoBoton.addEventListener("click", xd2);

      
      //boton_ver
      const miNodoBotonVer = document.createElement("a");
      miNodoBotonVer.classList.add("btn", "btn-success");
      miNodoBotonVer.textContent = "Ver Producto"; // es el signo de agregar a carrito
      miNodoBotonVer.setAttribute("marcador", info.id);
      miNodoBotonVer.setAttribute("href", "producto.html");   
     

      //Insertamos
      miNodoBody.appendChild(miNodoImagen);
      miNodoBody.appendChild(miNodoTitulo);
      miNodoBody.appendChild(miNodoDescripcion); //
      miNodoBody.appendChild(miNodoPrecio);
      miNodoBody.appendChild(miNodoBoton);
      miNodoBody.appendChild(miNodoBotonVer);
      miNodo.appendChild(miNodoBody);
      DOMitems.appendChild(miNodo);

    });
  }


 



 //evento añadir producto al carrito

  function añadirProductoAlCarrito(evento) {
    //añadir el nodo a nuestro carrito
    carrito.push(evento.target.getAttribute("marcador"));
    //actualizar el carrito
    renderizarCarrito();
  }

  function renderizarCarrito() {
    // vaciamos todo el html
    DOMcarrito.textContent = "";
    // quitamos los duplicados
    const carritoSinDuplicados = [...new Set(carrito)];
    //generamos los nodos a partir del carrito
    carritoSinDuplicados.forEach((item) => {
      //obtenemos el item que necesitamos de la variable base de datos
      const miItem = baseDeDatos.filter((itemBaseDatos) => {
        // coincide los id? solo puede existir un caso
        return itemBaseDatos.id === parseInt(item);
      });
      // cuenta el numero de veces que se repite el producto
      const numeroUnidadesItem = carrito.reduce((total, itemId) => {
        //coinciden los id? si coinciden se incrementa el contador, en caso contrario se mantiene el contador igual
        return itemId === item ? (total += 1) : total;
        //si no se aplica lo de reduce te da el '0'
      }, 0);

      
      // creamos el nodo del item del carrito
      const miNodo = document.createElement("li");
      miNodo.classList.add("list-group-item", "text-right", "mx-2");
      miNodo.textContent = `Cant: <${numeroUnidadesItem}>  Producto: "${miItem[0].nombre_Comercial}" Precio: ${miItem[0].precio}${divisa}`;
    
      
      //boton de borrar
      const miBoton = document.createElement("button");
      miBoton.classList.add("btn", "btn-danger", "mx-5");
      miBoton.textContent = "Borrar item";
      miBoton.style.marginLeft = "1rem";
      miBoton.dataset.item = item;
      miBoton.addEventListener("click", borrarItemCarrito);

      //mezclamos nodos
      miNodo.appendChild(miBoton);
      DOMcarrito.appendChild(miNodo);

       //modal Producto nombre
      const modalProducto = document.querySelector(".modalProducto")
      modalProducto.textContent = `${miItem[0].nombre_Comercial}`
    });
    //renderizamos el precio total en el html
    DOMtotal.textContent = calcularTotal();
    // renderizamos precio total en el modal
    const modalTotal= document.querySelector(".modalTotal");
    modalTotal.textContent = calcularTotal()



    var DateTime = luxon.DateTime;
    const now = DateTime.now().toFormat('MMMM dd, yyyy');
    const fechaModal = document.querySelector("#fechaModal")
    fechaModal.textContent = now




   
  }


 

  //evento para borrar un elemento del carrito
  function borrarItemCarrito(evento) {
    //obtenemos el producto id que hay en el boton pulsado
    const id = evento.target.dataset.item;
    //borramos los productos
    carrito = carrito.filter((carritoId) => {
      return carritoId !== id;
    });
    
    //volvemos a renderizar
    renderizarCarrito();
  }




  //calcula el precio total teniendo en cuenta los productos repetidos

  function calcularTotal() {
    //recorremos el array del carrito
    return carrito
      .reduce((total, item) => {
         // por cada item del carrito vamos a obtener su precio
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
          return itemBaseDatos.id === parseInt(item);
        });
        // los sumamos al total
        return total + miItem[0].precio;
      }, 0)
      .toFixed(2); //decimales
  }



  //vaciar el carrito
  function vaciarCarrito() {
    //limpiar los productos guardados
    carrito = [];
    // renderizamos los cambios
    renderizarCarrito();
  }



  
  //eventos
  DOMbotonVaciar.addEventListener("click", vaciarCarrito);

  //inicio
  renderizarProductos();
  renderizarCarrito();

  //alerta compra realizada con libreria.
  const modalBotonComprar = document.querySelector("#btnOkModal");
  modalBotonComprar.addEventListener("click", xd);
  //fecha actual
  var DateTime = luxon.DateTime;
  const now = DateTime.now().toFormat('MMMM dd, yyyy');

  function xd(){
    swal({
      title: "Compra Realizada con Exito!",
      text: `Compra realizada el dia: "${now}"`,
      icon: "success",
    });
  }

  function xd2(){
    swal({
      title: "Producto agregado al 'Carrito' con Exito!",
      icon: "success",
    });
  }
  



});
