interface ApiRequestOptions {
	useLoading?: boolean
	showProgress?: false | 'on-upload' | 'on-download' | 'always'
	showError?: false | 'modal' | 'notification'
	showSuccess?: false | 'modal' | 'notification'
}

function useApiRequest<T>(serviceMethod: () => Promise<T>, options?: ApiRequestOptions): Promise<T> {
	const { useLoading, showProgress, showError, showSuccess } = options || {}

	const loadingHandler = useLoading ? useLoading() : null
	const errorHandler = showError ? useApiErrorHandler(showError) : null
	const successHandler = showSuccess ? useApiSuccessHandler(showSuccess) : null

	if (loadingHandler) {
		loadingHandler.start()
	}

	return serviceMethod()
		.then((response) => {
			if (loadingHandler) {
				loadingHandler.stop()
			}
			
			if (successHandler) {
				successHandler('Request successful')
			}

			return response
		})
		.catch((error) => {
			if (loadingHandler) {
				loadingHandler.stop()
			}
			
			if (errorHandler) {
				errorHandler('error', 'Request failed')
			}
		})
}