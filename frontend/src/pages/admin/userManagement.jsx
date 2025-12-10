import React, { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} from "../../services/userService.js";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [modalUser, setModalUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

useEffect(() => {
  const fetchData = async () => {
    await loadUsers();
  };
  fetchData();
}, []);

  const handleRoleChange = async (id, role) => {
    try {
      await updateUser(id, { role });
      await loadUsers();
      alert("Rol actualizado correctamente");
    } catch (err) {
      console.error(err);
      alert("No puedes asignar rol participant");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    }
  };

  const handlePasswordChange = async (id) => {
    const password = prompt("Nueva contraseña:");
    if (!password) return;
    try {
      await changePassword(id, password);
      alert("Contraseña cambiada");
    } catch (err) {
      console.error(err);
      alert("Error al cambiar contraseña");
    }
  };

  const openCreateModal = () => {
    setModalUser({ nombre: "", email: "", password: "", role: "participant" });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalUser({ ...user, password: "" });
    setShowModal(true);
  };

  const handleSaveUser = async () => {
    if (!modalUser.nombre || !modalUser.email) return alert("Completa todos los campos");
    try {
      if (modalUser.id) {
        await updateUser(modalUser.id, { nombre: modalUser.nombre, email: modalUser.email });
        alert("Usuario actualizado correctamente");
      } else {
        if (!modalUser.password) return alert("Ingresa una contraseña");
        await createUser({ nombre: modalUser.nombre, email: modalUser.email, password: modalUser.password, rol: modalUser.role });
        alert("Usuario creado correctamente");
      }
      setShowModal(false);
      setModalUser(null);
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.mensaje || "Revisa la consola"));
    }
  };

  return ( 
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Gestión de Usuarios</h2>
        <button className="btn btn-success" onClick={openCreateModal}>Crear Nuevo Usuario</button>
      </div>

      {showModal && (
        <>
          <div className="modal-backdrop show" onClick={() => { setShowModal(false); setModalUser(null); }} />
          <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{modalUser?.id ? "Editar Usuario" : "Crear Usuario"}</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => { setShowModal(false); setModalUser(null); }} />
                </div>
                <div className="modal-body">
                  <input className="form-control mb-2" placeholder="Nombre" value={modalUser?.nombre || ""} onChange={e => setModalUser({ ...modalUser, nombre: e.target.value })} />
                  <input className="form-control mb-2" placeholder="Email" value={modalUser?.email || ""} onChange={e => setModalUser({ ...modalUser, email: e.target.value })} />
                  {!modalUser?.id && (
                    <input className="form-control mb-2" type="password" placeholder="Contraseña" value={modalUser?.password || ""} onChange={e => setModalUser({ ...modalUser, password: e.target.value })} />
                  )}
                  <select className="form-select" value={modalUser?.role || "participant"} onChange={e => setModalUser({ ...modalUser, role: e.target.value })}>
                    <option value="participant">Participante</option>
                    <option value="organizer">Organizador</option>
                    <option value="admin">Admin</option>
                    <option value="validator">Validador</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => { setShowModal(false); setModalUser(null); }}>Cancelar</button>
                  <button className="btn btn-primary" onClick={handleSaveUser}>{modalUser?.id ? "Guardar" : "Crear"}</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>
                <select className="form-select" value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)} disabled={u.role === "participant"}>
                  <option value="participant">Participante</option>
                  <option value="organizer">Organizador</option>
                  <option value="admin">Admin</option>
                  <option value="validator">Validador</option>
                </select>
              </td>
              <td>
                <div className="d-flex gap-2">
                  {u.role !== "participant" && (
                    <>
                      <button className="btn btn-sm btn-secondary" onClick={() => openEditModal(u)}>Editar</button>
                      <button className="btn btn-sm btn-info" onClick={() => handlePasswordChange(u.id)}>Contraseña</button>
                    </>
                  )}
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
