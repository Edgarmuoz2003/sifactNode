const express = require('express');
const loginController = require('../controllers/loginControllers');
const router = express.Router();


// RUTAS LOGIN
router.get('/login', loginController.login);
router.post('/login', loginController.auth);
router.get('/logout', loginController.logout);

// RUTAS GESTION DE USUARIOS
router.get('/usuarios', loginController.register);
router.post('/usuarios',loginController.storeUser);
router.get('/consultar', loginController.consultar);
router.post('/consultar', loginController.buscar);
router.get('/volver', loginController.volver);
router.get('/eliminar/:ID', loginController.eliminar);
router.get('/modificar/:ID', loginController.modificar);
router.post('/modificar/:ID', loginController.actualizar)

// RUTAS PROVEEDORES
router.get('/proveedores', loginController.renderProveedores);
router.post('/proveedores', loginController.buscarProveedor);
router.get('/proveedores/registrar', loginController.registrarProveedores);
router.post('/proveedores/registrar', loginController.guardarProveedor);
router.get('/proveedores/eliminar/:NIT', loginController.eliminarProveedor);
router.get('/proveedores/modificar/:NIT', loginController.modifySupplier);
router.post('/proveedores/modificar/:NIT', loginController.updateSupplier);

//RUTAS CLIENTES
router.get('/clientes', loginController.renderClientes);
router.post('/clientes', loginController.buscarCliente);
router.get('/clientes/registrar', loginController.registrarCliente);
router.post('/clientes/registrar', loginController.guardarCliente);
router.get('/clientes/eliminar/:ID', loginController.eliminarCliente);
router.get('/clientes/modificar/:ID', loginController.modificarCliente);
router.post('/clientes/modificar/:ID', loginController.actualizarCliente);

//RUTAS PRODUCTOS
router.get('/productos', loginController.renderproductos);
router.post('/productos/buscar', loginController.buscarProducto);
router.get('/productos/registrar', loginController.registrarProducto);
router.post('/productos/registrar', loginController.guardarProducto);
router.get('/productos/eliminar/:CODIGO', loginController.eliminarProducto);
router.get('/productos/modificar/:CODIGO', loginController.modificarProductos);
router.post('/productos/modificar/:CODIGO', loginController.actualizarProductos);

//RITAS CONFIGURACIONES
router.get('/configuraciones', loginController.renderConfig);
router.post('/configuraciones', loginController.guardarConfig);
router.get('/configuraciones/factura', loginController.renderConfigNum);
router.post('/configuraciones/factura', loginController.guardarConfigNum);
router.get('/configuraciones/dian', loginController.renderConfigDian);
router.post('/configuraciones/dian', loginController.guardarresDian);

//RUTAS FACTURACION
router.get('/facturacion/nueva', loginController.addFactura);
router.post('/facturacion', loginController.cargarCliente);





module.exports = router