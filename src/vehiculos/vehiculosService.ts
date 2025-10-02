import axiosVehiculo from './axiosVehiculo';

export interface Vehiculo {
  id_vehiculo?: number;
  tipo: string;
  placa: string;
  marca: string;
  modelo: string;
  estado: string;
  id_usuario: {
    id_usuario: number;
    nombres: string;
    apellidos: string;
    nip: string;
  };
}

export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  nip: string;
}

// Obtener todos los vehículos
export const getVehiculos = async (): Promise<Vehiculo[]> => {
    try {
  const response = await axiosVehiculo.get<Vehiculo[]>('/api/vehiculos');
  return response.data;
} catch (error) {
    console.error('Error al obtener reportes:', error);
    throw error;
  }
  }

// Crear vehículo
export const createVehiculo = async (vehiculo: Omit<Vehiculo, 'id_vehiculo' | 'id_usuario'> & { id_usuario: number }) => {
  const { data } = await axiosVehiculo.post('/api/vehiculos/', vehiculo);
  return data;
};

  export const getUsuarios = async (): Promise<Usuario[]> => {
    try {
  const response = await axiosVehiculo.get<Usuario[]>('/api/usuarios');
  return response.data;
} catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
  }


  // Obtener un vehículo por ID
export const getVehiculoById = async (id: number): Promise<Vehiculo> => {
  const { data } = await axiosVehiculo.get<Vehiculo>(`/api/vehiculos/${id}`);
  return data;
};

// Crear control de vehículo
export interface ControlVehiculo {
  id_vehiculo: number;
  km_salida: number;
  km_entrada: number | null;
  servicio_km: number;
}
export const createControlVehiculo = async (control: ControlVehiculo) => {
  const { data } = await axiosVehiculo.post('/api/control', control);
  return data;
};


// Cambiar piloto de un vehículo
export const cambiarPiloto = async (idVehiculo: number, idUsuario: number) => {
  const { data } = await axiosVehiculo.put(`/api/vehiculos/${idVehiculo}`, {
    id_usuario: idUsuario,
  });
  return data;
};

// Actualizar km_entrada de un control
export const updateKmEntrada = async (idControl: number, kmEntrada: number) => {
  const { data } = await axiosVehiculo.put(`/api/control/${idControl}`, {
    km_entrada: kmEntrada,
  });
  return data;
};


export interface Control {
  id_control: number;
  id_vehiculo: number;
  km_salida: number;
  km_entrada: number | null;
  servicio_km: number;
  fecha_control: string;
}

// Obtener controles de un vehículo
export const getControlesByVehiculo = async (vehiculoId: number): Promise<Control[]> => {
  const { data } = await axiosVehiculo.get<Control[]>(`/api/control/vehiculo/${vehiculoId}`);
  return data;
};

// Obtener solo los vehículos del usuario logueado
export const getMisVehiculos = async (): Promise<Vehiculo[]> => {
  try {
    const response = await axiosVehiculo.get<Vehiculo[]>('/api/vehiculos/mis-vehiculos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener vehículos del usuario:', error);
    throw error;
  }
};