let productosEnElCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
console.log(productosEnElCarrito);



fetch("/data/productos.json")
    .then(res => res.json())
    .then(data => {
        mostrarProductosBaseDatos(data);
    })

const contenedorProductos = document.querySelector("#contenedor-productos");
const carritoVacio = document.querySelector("#carrito-vacio");
const productosCarrito = document.querySelector("#productos-carrito");
const totalCarrito = document.querySelector("#total-carrito");
const botonVaciarCarrito = document.querySelector("#boton-vaciar-carrito");
const botonFinalizarCompra = document.querySelector("#boton-finalizar-compra");

// recorremos el array para mostrar los prod en pantalla
function mostrarProductosBaseDatos(productos){
productos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("card-productos");
    div.innerHTML = `
    <img class="imagen-producto" src="${producto.img}" alt="${producto.titulo}">
    <h3>${producto.titulo}</h3>
    <p class="blanco">$${producto.precio}</p>
    
    `;
    //creamos o traemos el boton a parte, y le definimos el evento
    const boton = document.createElement("button");
    boton.classList.add("btn-comprar");
    boton.innerText = "Agregar al carrito";

    // definimos el evento del boton agregar al carrito
    boton.addEventListener("click", () => {
        agregarProductosAlCarrito(producto);
    })
    div.append(boton); //ponemos el boton dentro del div
    contenedorProductos.append(div);

})
}

function actualizarCarrito() {
    if (productosEnElCarrito.length === 0) {
        carritoVacio.classList.remove("disabled");
        productosCarrito.classList.add("disabled");
        botonVaciarCarrito.classList.add("disabled");
        botonFinalizarCompra.classList.add("disabled");
    } else {
        carritoVacio.classList.add("disabled");
        productosCarrito.classList.remove("disabled");
        botonVaciarCarrito.classList.remove("disabled");
        botonFinalizarCompra.classList.remove("disabled");

        productosCarrito.innerHTML = "";

        productosEnElCarrito.forEach((producto) => {
            const div = document.createElement("div");
            div.classList.add("producto-carrito");
            div.innerHTML = `
            <img class="producto-carrito-imagen" src="${producto.img}" alt="${producto.titulo}">
                <h5>${producto.titulo}</h5>
                <p>Cantidad:</p>
                <p>${producto.cantidad}</p>
                <p>Precio:</p>
                <p>$${producto.precio}</p>
                <p>Subtotal:</p>
                <p>$${producto.precio * producto.cantidad}</p>
                
            `;

            const botonSumar = document.createElement("button");
            botonSumar.classList.add("boton-sumar-productos-carrito");
            botonSumar.innerText = "⬆️";
            botonSumar.addEventListener("click", () => {
                sumarCarrito(producto);
            });

            div.append(botonSumar);

            const botonRestar = document.createElement("button");
            botonRestar.classList.add("boton-restar-productos-carrito");
            botonRestar.innerText = "⬇️";
            botonRestar.addEventListener("click", () => {
                restarCarrito(producto);
            });

            div.append(botonRestar);

            const botonEliminar = document.createElement("button");
            botonEliminar.classList.add("boton-eliminar-productos-carrito");
            botonEliminar.innerText = "❎";
            botonEliminar.addEventListener("click", () => {
                borrarDelCarrito(producto);
            });

            div.append(botonEliminar);
            productosCarrito.append(div);

        })
    }
    actualizarTotal();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnElCarrito));
}
actualizarCarrito();
//funcion que se llama cuando agregamos un producto al carrito desde el boton
function agregarProductosAlCarrito(producto) {
    const itemEncontrado = productosEnElCarrito.find(item => item.titulo === producto.titulo);

    if(itemEncontrado) {
        itemEncontrado.cantidad++;
    } else {
        productosEnElCarrito.push({...producto, cantidad: 1}); //hago un spread de objeto y le agrego la propiedad de cantidad, que no lo tenia de principio
    }

actualizarCarrito();

Toastify({
    text: "Se agregó tu producto al carrito!",
    gravity: "bottom",
    duration: 1000,
    className: "info",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    }
  }).showToast();

}

const borrarDelCarrito = (producto) => {
    const productoIndex = productosEnElCarrito.findIndex(item => item.titulo === producto.titulo);

    productosEnElCarrito.splice(productoIndex, 1);
    actualizarCarrito();

}

function sumarCarrito(producto) {
    producto.cantidad++;
    actualizarCarrito();
}

function restarCarrito(producto) {

    if(producto.cantidad !== 1) {
        producto.cantidad--;
    } 
    actualizarCarrito();
}

function actualizarTotal() {
    const total = productosEnElCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    totalCarrito.innerText = `$${total}`;
}

botonVaciarCarrito.addEventListener("click", () => {
    productosEnElCarrito.length = 0;
    actualizarCarrito();
})

botonFinalizarCompra.addEventListener("click", () => {
 
    setTimeout(() => {
        Swal.fire("Gracias por su compra!");
    },100);
  
})

