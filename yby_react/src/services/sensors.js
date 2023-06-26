import Api from './api'

const SensorsService = {
    index: () => Api.get('/sensors',
        {headers: {'x-access-token': localStorage.getItem('token')}
    }),

    create: (params) => Api.post('/sensors', params,
        {headers: {'x-access-token': localStorage.getItem('token')}
    }),
    delete: (id) => Api.delete(`/sensors/${id}`,
        {headers: {'x-access-token': localStorage.getItem('token')}
    }),
    update: (id, params) => Api.put(`/sensors/${id}`, params,
        {headers: {'x-access-token': localStorage.getItem('token')}
    }),
}

export default SensorsService