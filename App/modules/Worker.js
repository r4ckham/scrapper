import Worker from 'worker_threads'

function executeWorker(file) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(file)

        // Une fois le worker actif
        worker.on('online', () => {
            console.log('DEBUT : Execution de la tâche intensive en parallèle')
        })

        // Si un message est reçu du worker
        worker.on('message', (workerMessage) => {
            return resolve
        })

        worker.on('error', reject)
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`))
            }
        })
    })
}
