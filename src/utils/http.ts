const baseUrl = 'https://api.noo-school.ru'
//const baseUrl = 'http://localhost:3000'

async function request(
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: any,
  catch401 = true
) {
  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }

  if (method === 'GET' && body) {
    url += `?${new URLSearchParams(body).toString()}`
  } else if (body && !(body instanceof FormData)) {
    // @ts-ignore
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  } else if (body && body instanceof FormData) {
    options.body = body
  }

  try {
    const response = await fetch(`${baseUrl}${url}`, options)

    if (!response.ok) throw { status: response.status }

    const result = await response.text()

    if (!result) return

    return JSON.parse(result, (_, value) =>
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
        ? new Date(value)
        : value
    )
  } catch (error: any) {
    if (error.status === 401 && catch401) {
      localStorage.clear()
      location.reload()
    }

    throw error
  }
}

function get(url: string, body?: any, catch401 = true) {
  return request(url, 'GET', body, catch401)
}

function post(url: string, body?: any, catch401 = true) {
  return request(url, 'POST', body, catch401)
}

function patch(url: string, body?: any, catch401 = true) {
  return request(url, 'PATCH', body, catch401)
}

function remove(url: string, body?: any, catch401 = true) {
  return request(url, 'DELETE', body, catch401)
}

function file(files: File[]) {
  const formData = new FormData()

  for (const file of files) {
    formData.append('files', file)
  }

  return request('/media', 'POST', formData, false)
}

export const http = {
  get,
  post,
  patch,
  remove,
  file
}
