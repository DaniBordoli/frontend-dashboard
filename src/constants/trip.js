export const TRIP_STATUS = {
  SOLICITADO: 'solicitado',
  COTIZANDO: 'cotizando',
  CONFIRMADO: 'confirmado',
  EN_ASIGNACION: 'en_asignacion',
  EN_CURSO: 'en_curso',
  FINALIZADO: 'finalizado'
};

export const TRIP_STATUS_LABELS = {
  [TRIP_STATUS.SOLICITADO]: 'Solicitado',
  [TRIP_STATUS.COTIZANDO]: 'Cotizando',
  [TRIP_STATUS.CONFIRMADO]: 'Confirmado',
  [TRIP_STATUS.EN_ASIGNACION]: 'En Asignación',
  [TRIP_STATUS.EN_CURSO]: 'En Curso',
  [TRIP_STATUS.FINALIZADO]: 'Finalizado'
};

export const CHECKIN_TYPES = {
  LLEGUE_A_CARGAR: 'llegue_a_cargar',
  CARGADO: 'cargado',
  SALI: 'sali',
  DESCARGUE: 'descargue'
};

export const CHECKIN_TYPE_LABELS = {
  [CHECKIN_TYPES.LLEGUE_A_CARGAR]: 'Llegué a Cargar',
  [CHECKIN_TYPES.CARGADO]: 'Cargado',
  [CHECKIN_TYPES.SALI]: 'Salí',
  [CHECKIN_TYPES.DESCARGUE]: 'Descargué'
};

export const DESTINATION_TYPES = {
  PUERTO: 'puerto',
  ACOPIO: 'acopio'
};

export const DESTINATION_TYPE_LABELS = {
  [DESTINATION_TYPES.PUERTO]: 'Puerto',
  [DESTINATION_TYPES.ACOPIO]: 'Acopio'
};
