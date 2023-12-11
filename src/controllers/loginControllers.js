const bcrypt = require('bcrypt');
const { query } = require('express');

// CONTROLADORES DE LOGIN

function login(req, res) {
    if(req.session.loggedin != true){
        res.render('login/index', {layout: 'main.hbs'})
    }else{
        res.redirect('/')
    }
    
};



function auth(req, res) {
    const data = req.body

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM empleados WHERE ID = ?', [data.ID], (err, userdata) => {
            if (userdata.length > 0) {

                userdata.forEach(element => {
                    bcrypt.compare(data.password, element.password, (err, isMatch) => {
                        if (!isMatch) {
                            res.render('login/index', { error: 'Contraseña Incorrecta', layout: 'main.hbs' })
                         } else {
                            req.session.loggedin = true;
                            req.session.name = element.NOMBRE;
                            req.session.cargo = element.CARGO;
                            
                            res.redirect('/')
                        }
                    });
                });
            } else {
                res.render('login/index', { error: 'error: el usuario no Existe' })
            }
        })
    })
};

function logout(req, res) {

    if(req.session.loggedin == true){
        req.session.destroy()

    } 
        res.redirect('/login')
      
};

// CONTROLADORES GESTION DE USUARIOS

function register(req, res) {
    res.render('administrador/registro', {
        name: req.session.name, 
        cargo: req.session.cargo, 
        accion: 'Gestion de Usuarios' 
    } )    
};

function storeUser(req, res) {
    const data = req.body;


   req.getConnection((err, conn) => {
        conn.query('SELECT * FROM empleados WHERE ID = ?', [data.ID], (err, userdata) => {
            
             if(userdata.length > 0 ){
                 res.render('administrador/registro', { error: 'error: el usuario ya Existe'})
             }else{
                 bcrypt.hash(data.password, 12).then(hash => {
                     data.password = hash;
                    
                      req.getConnection((err, conn) => {
                          conn.query('INSERT INTO empleados SET ?', [data], (err, rows) => {
                              res.render('administrador/registro', {
                                mensaje: 'Se a guardado un nuevo usuario',
                                name: req.session.name, 
                                cargo: req.session.cargo, 
                                accion: 'Gestion de Usuarios'
                            })
                          })
                      })
                 })

             }
        } )
    })
    
};

function consultar(req, res) {
  res.render('administrador/consultar', {
    name: req.session.name, 
    cargo: req.session.cargo, 
    accion: 'Gestion de Usuarios' 
})
};

function buscar(req, res) {
    const data = req.body

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM empleados WHERE ID = ?', [data.ID], (err, userdata) =>{
            if(userdata.length === 0) {
                res.render('administrador/consultar', {
                    error: 'No existe un Empleado con esa Identificasion, Verifique e intente de nuevo!!!',
                    name: req.session.name, 
                    cargo: req.session.cargo, 
                    accion: 'Gestion de Usuarios'
                } )
            }else{
               
               res.render('administrador/consultar', {
                data: userdata[0],
                name: req.session.name, 
                cargo: req.session.cargo, 
                accion: 'Gestion de Usuarios'
            } )
            }
            
        })
    })
};

function volver(req, res) {
    res.redirect('/')
};

  function eliminar(req, res) {
    const { ID } = req.params
    req.getConnection((err, conn) => {
        conn.query( 'DELETE FROM empleados WHERE ID = ?', [ID], (err, rows) =>{
            res.render('administrador/consultar', {
                name: req.session.name, 
                cargo: req.session.cargo, 
                accion: 'Gestion de Usuarios'
            })
        })
    
    })
  };

 function modificar(req, res) {
    const { ID } = req.params

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM empleados WHERE ID = ?', [ID], (err, userdata) => {
            res.render('administrador/Modificar',{
                data: userdata[0],
                name: req.session.name, 
                cargo: req.session.cargo, 
                accion: 'Gestion de Usuarios'                
            })
        })
    })
    
  };

  function actualizar(req, res) {
    const { ID } = req.params
    const { NOMBRE, CARGO, USUARIO} = req.body
    const newUser = {
        NOMBRE,
        CARGO,
        USUARIO,   
    }

    req.getConnection((err, conn) => {
        conn.query('UPDATE empleados SET ? WHERE ID = ?', [newUser, ID], (err, rows) => {
            res.render('administrador/consultar', {
                mensaje: 'El usuario a sido actualizado',
                name: req.session.name, 
                cargo: req.session.cargo,
                accion: 'Gestion de Usuarios'
            })
        })
    })
  };

// CONTROLADORES PROVEEDORES

function renderProveedores(req, res) {
    res.render('administrador/proveedores', {
        name: req.session.name, 
        cargo: req.session.cargo, 
        accion2: 'proveedores'
    })
};

function registrarProveedores(req, res){
    res.render('administrador/registro-proveedores', {
        name: req.session.name, 
        cargo: req.session.cargo, 
        accion2: 'proveedores'
    })
};

function guardarProveedor(req, res) {
    const data = req.body;
   req.getConnection((err, conn) => {
        conn.query('SELECT * FROM proveedores WHERE NIT = ?', [data.NIT], (err, userdata) => {
            
             if(userdata.length > 0 ){
                 res.render('administrador/registro-proveedores', { error: 'error: el proveedor ya Existe'})
             }else{                  
                req.getConnection((err, conn) => {
                    conn.query('INSERT INTO proveedores SET ?', [data], (err, rows) => {
                        res.render('administrador/registro-proveedores', {
                         mensaje: 'Se a guardado un nuevo proveedor',
                        name: req.session.name, 
                        cargo: req.session.cargo, 
                        accion2: 'proveedores'
                     })
                    })
                }) 
             }
        } )
    })
    
};

function buscarProveedor(req, res) {
    const data = req.body

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM proveedores WHERE NIT = ?', [data.NIT], (err, userdata) =>{
            if(userdata.length === 0) {
                res.render('administrador/proveedores', {
                    error: 'No se encontró ningun proveedor con ese NIT, Verifique e intente de nuevo!!!',
                    name: req.session.name, 
                    cargo: req.session.cargo, 
                    accion2: 'proveedores'
                } )
            }else{
               
               res.render('administrador/proveedores', {
                data: userdata[0],
                name: req.session.name, 
                cargo: req.session.cargo, 
                accion2: 'proveedores'
            } )
            }
            
        })
    })
};

function eliminarProveedor(req, res) {
const { NIT } = req.params
req.getConnection((err, conn) => {
    conn.query( 'DELETE FROM proveedores WHERE NIT = ?', [NIT], (err, rows) =>{
        res.render('administrador/proveedores', {
            eliminado: 'El proveedor a sido eliminado',
            name: req.session.name, 
            cargo: req.session.cargo, 
            accion2: 'proveedores'
        })
    })
    
})
};

function modifySupplier(req, res) {
    const { NIT } = req.params

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM proveedores WHERE NIT = ?', [NIT], (err, userdata) => {
            res.render('administrador/modify-supplier',{
                data: userdata[0],
                name: req.session.name, 
                cargo: req.session.cargo, 
                accion2: 'proveedores'                
            })
        })
    })
    
  };

function updateSupplier(req, res) {
const { NIT } = req.params
const data = req.body

req.getConnection((err, conn) => {
    conn.query('UPDATE proveedores SET ? WHERE NIT = ?', [data, NIT], (err, rows) => {
        res.render('administrador/modify-supplier', {
            actualizado: 'proveedor actualizado',
            name: req.session.name, 
            cargo: req.session.cargo,
            accion2: 'proveedores'
        })
    })
})
};

// CONTROLADORES CLIENTES
function renderClientes(req, res) {
    res.render('administrador/clientes', {
        name: req.session.name, 
        cargo: req.session.cargo, 
        accion3: 'clientes'
    })
};

function buscarCliente(req, res) {
    const data = req.body

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM clientes WHERE ID = ?', [data.ID], (err, userdata) =>{
            if(userdata.length === 0) {
                res.render('administrador/clientes', {
                    error: 'No se encontró ningun cliente con esa Identificación, Verifique e intente de nuevo!!!',
                    name: req.session.name, 
                    cargo: req.session.cargo, 
                    accion3: 'clientes'
                } )
            }else{
               
               res.render('administrador/clientes', {
                data: userdata[0],
                name: req.session.name, 
                cargo: req.session.cargo, 
                accion3: 'clientes'
            } )
            }
            
        })
    })
};

function registrarCliente(req, res){
    res.render('administrador/registro-clientes', {
        name: req.session.name, 
        cargo: req.session.cargo, 
        accion3: 'clientes'
    })
};

function guardarCliente(req, res) {
    const data = req.body;
   req.getConnection((err, conn) => {
    conn.query('INSERT INTO clientes SET ?', [data], (err, rows) => {
        if (err) {
            console.error(err);
            res.render('administrador/registro-clientes', { error: 'Error al guardar el cliente' });
        } else {
            res.render('administrador/registro-clientes', {
                mensaje: 'Se ha guardado un nuevo cliente',
                name: req.session.name,
                cargo: req.session.cargo,
                accion3: 'clientes'
            });
        }
    });
    })
    
};

function eliminarCliente(req, res) {
    const { ID } = req.params
    req.getConnection((err, conn) => {
        conn.query( 'DELETE FROM clientes WHERE ID = ?', [ID], (err, rows) =>{
            res.render('administrador/clientes', {
                eliminado: 'El cliente a sido eliminado',
                name: req.session.name, 
                cargo: req.session.cargo, 
                accion3: 'clientes'
            })
        })
        
    })
};

function modificarCliente(req, res) {
    const { ID} = req.params

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM clientes WHERE ID = ?', [ID], (err, userdata) => {
            res.render('administrador/modificar-cliente',{
                data: userdata[0],
                name: req.session.name, 
                cargo: req.session.cargo, 
                accion3: 'clientes'                
            })
        })
    })
    
};

function actualizarCliente(req, res) {
    const { ID } = req.params
    const data = req.body
    
    req.getConnection((err, conn) => {
        conn.query('UPDATE clientes SET ? WHERE ID = ?', [data, ID], (err, rows) => {
            res.render('administrador/modificar-cliente', {
                actualizado: 'El cliente a sido actualizado',
                name: req.session.name, 
                cargo: req.session.cargo,
                accion3: 'clientes'  
            })
        })
    })
};

//CONTROLADORES PRODUCTOS
function renderproductos(req, res) {
    res.render('administrador/productos', {
        name: req.session.name, 
        cargo: req.session.cargo, 
        accion4: 'productos'
    })
};

function buscarProducto(req, res) {
    const { DESCRIPCION } = req.body;

    req.getConnection((err, conn) => {
        
        const searchTerm = `%${DESCRIPCION}%`;

        conn.query('SELECT * FROM productos WHERE DESCRIPCION LIKE ?', [searchTerm], (err, productos) => {
        
            if (productos.length === 0) {
                return res.render('administrador/productos', { 
                    error: 'No se encontró ningún producto con esa descripción. Verifique e intente de nuevo!!!',
                    name: req.session.name, 
                    cargo: req.session.cargo, 
                    accion4: 'productos'
                });
            }

            res.render('administrador/productos', {  
                data: productos,
                name: req.session.name, 
                cargo: req.session.cargo, 
                accion4: 'productos' 
            });
        });
    });
}

function registrarProducto(req, res){
    res.render('administrador/registro-productos', {
        name: req.session.name, 
        cargo: req.session.cargo, 
        accion4: 'productos'
    })
};

function guardarProducto(req, res) {
    const data = req.body;
   req.getConnection((err, conn) => {
    conn.query('INSERT INTO productos SET ?', [data], (err, rows) => {
        if (err) {
            console.error(err);
            res.render('administrador/registro-productos', { error: 'Error al guardar el cliente' });
        } else {
            res.render('administrador/registro-productos', {
                mensaje: 'Se ha guardado un nuevo producto',
                name: req.session.name,
                cargo: req.session.cargo,
                accion4: 'productos'
            });
        }
    });
    })
    
};

function eliminarProducto(req, res) {
    const { CODIGO } = req.params
    req.getConnection((err, conn) => {
        conn.query( 'DELETE FROM productos WHERE CODIGO = ?', [CODIGO], (err, rows) =>{
            res.render('administrador/productos', {
                eliminado: 'El producto a sido eliminado',
                name: req.session.name, 
                cargo: req.session.cargo, 
                accion4: 'productos'
            })
        })
        
    })
};

function modificarProductos(req, res) {
    const { CODIGO } = req.params

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM productos WHERE CODIGO = ?', [CODIGO], (err, userdata) => {
            res.render('administrador/modificar-productos',{
                data: userdata[0],
                name: req.session.name, 
                cargo: req.session.cargo, 
                accion4: 'productos'                
            })
        })
    })
    
};

function actualizarProductos(req, res) {
    const { CODIGO } = req.params
    const data = req.body
    
    req.getConnection((err, conn) => {
        conn.query('UPDATE productos SET ? WHERE CODIGO = ?', [data, CODIGO], (err, rows) => {
            res.render('administrador/modificar-productos', {
                actualizado: 'El producto a sido actualizado',
                name: req.session.name, 
                cargo: req.session.cargo,
                accion4: 'productos'  
            })
        })
    })
};


//Controladores Configuracion

function renderConfig(req, res) {
    res.render('administrador/configuraciones', {
        name: req.session.name, 
        cargo: req.session.cargo, 
        accion5: 'configuraciones'
    })
};

function guardarConfig(req, res) {
    const data = req.body;
   req.getConnection((err, conn) => {
    conn.query('INSERT INTO `datos-empresa` SET ?', [data], (err, rows) => {
        if (err) {
            console.error(err);
            res.render('administrador/configuraciones', { error: 'Error al guardar la configuracion' });
        } else {
            res.render('administrador/configuraciones', {
                mensaje: 'Se ha configurado correctamente ',
                name: req.session.name,
                cargo: req.session.cargo,
                accion5: 'configuraciones'
            });
        }
    });
    })
    
};

function renderConfigNum(req, res) {
    res.render('administrador/configurar-factura', {
        name: req.session.name, 
        cargo: req.session.cargo, 
        accion5: 'configuraciones'
    })
};

function guardarConfigNum(req, res) {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM `configuracion-factura`', (err, userdata) => {
            if (userdata.length > 0) {
                conn.query('UPDATE `configuracion-factura` SET ? WHERE id = 1 ', [data], (err, rows) => {
                    if (err) {
                        console.error(err);
                        res.render('administrador/configurar-factura', { error: 'Error al guardar la configuracion' });
                    } else {
                        // Después de actualizar, obtenemos los datos actualizados
                        conn.query('SELECT * FROM `configuracion-factura` WHERE id = 1', (err, updatedData) => {
                            if (err) {
                                console.error(err);
                                res.render('administrador/configurar-factura', { error: 'Error al obtener la configuracion actualizada' });
                            } else {
                                res.render('administrador/configurar-factura', {
                                    data: updatedData[0],
                                    mensaje: 'Se ha actualizado correctamente la configuracion ',
                                    name: req.session.name,
                                    cargo: req.session.cargo,
                                    accion5: 'configuraciones'
                                });
                            }
                        });
                    }                   
                })
            } else {
                conn.query('INSERT INTO `configuracion-factura` SET ?', data, (err, rows) => {
                    if (err) {
                        console.error(err);
                        res.render('administrador/configurar-factura', { error: 'Error al guardar la configuracion' });
                    } else {
                        // Después de insertar, obtenemos los datos recién insertados
                        conn.query('SELECT * FROM `configuracion-factura` WHERE id = 1', (err, insertedData) => {
                            if (err) {
                                console.error(err);
                                res.render('administrador/configurar-factura', { error: 'Error al obtener la configuracion actualizada' });
                            } else {
                                res.render('administrador/configurar-factura', {
                                    data: insertedData[0],
                                    mensaje: 'Se ha guardado correctamente la configuracion ',
                                    name: req.session.name,
                                    cargo: req.session.cargo,
                                    accion5: 'configuraciones'
                                });
                            }
                        });
                    } 
                }) 
            }
        })
    })
};

function renderConfigDian(req, res) {
    res.render('administrador/res-DIAN', {
        name: req.session.name, 
        cargo: req.session.cargo, 
        accion5: 'configuraciones'
    })
};

function guardarresDian(req, res) {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM `resolucion-dian`', (err, userdata) => {
            if (userdata.length > 0) {
                conn.query('UPDATE `resolucion-dian` SET ? WHERE id = 1 ', [data], (err, rows) => {
                    if (err) {
                        console.error(err);
                        res.render('administrador/res-DIAN', { error: 'Error al guardar la configuracion' });
                    } else {
                        // Después de actualizar, obtenemos los datos actualizados
                        conn.query('SELECT * FROM `resolucion-dian` WHERE id = 1', (err, updatedData) => {
                            if (err) {
                                console.error(err);
                                res.render('administrador/res-DIAN', { error: 'Error al obtener la configuracion actualizada' });
                            } else {
                                res.render('administrador/res-DIAN', {
                                    data: updatedData[0],
                                    mensaje: 'Se ha actualizado correctamente la configuracion ',
                                    name: req.session.name,
                                    cargo: req.session.cargo,
                                    accion5: 'configuraciones'
                                });
                            }
                        });
                    }                   
                })
            } else {
                conn.query('INSERT INTO `resolucion-dian` SET ?', data, (err, rows) => {
                    if (err) {
                        console.error(err);
                        res.render('administrador/res-DIAN', { error: 'Error al guardar la configuracion' });
                    } else {
                        // Después de insertar, obtenemos los datos recién insertados
                        conn.query('SELECT * FROM `resolucion-dian` WHERE id = 1', (err, insertedData) => {
                            if (err) {
                                console.error(err);
                                res.render('administrador/res-DIAN', { error: 'Error al obtener la configuracion actualizada' });
                            } else {
                                res.render('administrador/res-DIAN', {
                                    data: insertedData[0],
                                    mensaje: 'Se ha guardado correctamente la configuracion ',
                                    name: req.session.name,
                                    cargo: req.session.cargo,
                                    accion5: 'configuraciones'
                                });
                            }
                        });
                    } 
                }) 
            }
        })
    })
    
}

//CONTROLADORES FACTURACION

function ObtenerNumero(req, res, callback){
    req.getConnection((err, conn) => {
        if (err) {
            console.error(err);
            return callback(err, null);
        }
        
        conn.query('SELECT `siguiente-numero` FROM `configuracion-factura` ORDER BY id DESC LIMIT 1', (err, data) =>{
            if(err){
                console.error(err);
                return callback(err, null);
            } else {
                const numeroActual = data[0]['siguiente-numero'];
                return callback(null, numeroActual);
            }
        });
    });
}

function obtenerFechaHoraActual() {
    const fechaHoraActual = new Date();

    // Obtener componentes individuales de la fecha y hora
    const year = fechaHoraActual.getFullYear();
    const monthNumber = fechaHoraActual.getMonth() + 1; // Sumar 1 porque los meses van de 0 a 11
    const day = fechaHoraActual.getDate();
    const hours = fechaHoraActual.getHours().toString().padStart(2, '0');
    const minutes = fechaHoraActual.getMinutes().toString().padStart(2, '0');

    // Obtener el nombre del mes
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const monthName = monthNames[monthNumber - 1]; // Restar 1 para ajustarse al índice del array

    // Formatear la fecha y hora como string
    const fechaFormateada = `${day} de ${monthName} de ${year}`;
    const horaFormateada = `${hours}:${minutes}`;

    return { fecha: fechaFormateada, hora: horaFormateada };
}

function addFactura(req, res) {
    ObtenerNumero(req, res, (err, numeroFactura) => {
        if (err) {
            console.error(err);
            // Manejar el error, por ejemplo, renderizar una vista de error
            return res.render('cajero/facturacion', { error: 'Error al obtener el número de factura' });
        }

        const { fecha, hora } = obtenerFechaHoraActual();
        
        res.render('cajero/facturacion', {
            numeroFactura,
            fecha,
            hora,
            name: req.session.name,
            cargo: req.session.cargo,
            accion6: 'facturacion' 
        });
    });
}

function cargarCliente(req, res) {
    const data = req.body

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM clientes WHERE ID = ?', [data.ID], (err, userdata) =>{
            if(userdata.length === 0) {
                res.render('cajero/facturacion', {
                    error: 'No se encontró ningun cliente con esa Identificación, Verifique e intente de nuevo!!!',
                    name: req.session.name, 
                    cargo: req.session.cargo, 
                    accion3: 'clientes'
                } )
            }else{
               
               res.render('cajero/facturacion', {
                data: userdata[0],
                name: req.session.name, 
                cargo: req.session.cargo, 
                accion3: 'clientes'
            } )
            }
            
        })
    })
};









module.exports = {
    login,
    auth,
    logout,
    register,
    storeUser,
    consultar,
    volver,
    buscar,
    eliminar,
    modificar,
    actualizar,
    renderProveedores,
    buscarProveedor,
    registrarProveedores,
    guardarProveedor,
    eliminarProveedor,
    modifySupplier,
    updateSupplier,
    renderClientes,
    buscarCliente,
    registrarCliente,
    guardarCliente,
    eliminarCliente,
    modificarCliente,
    actualizarCliente,
    renderproductos,
    buscarProducto,
    registrarProducto,
    guardarProducto,
    eliminarProducto,
    modificarProductos,
    actualizarProductos,
    renderConfig,
    guardarConfig,
    renderConfigNum,
    guardarConfigNum,
    renderConfigDian,
    guardarresDian,
    addFactura,
    cargarCliente,
};
