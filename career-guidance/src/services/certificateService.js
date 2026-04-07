import { get, set } from './storageService'

const KEY = 'certificates'

export function getCertificates(userId) {
    const all = get(KEY) || []
    return all.filter(c => c.userId === userId).sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt))
}

export function getCertificateById(certId) {
    const all = get(KEY) || []
    return all.find(c => c.id === certId) || null
}

export function hasCertificate(userId, webinarId) {
    const all = get(KEY) || []
    return all.some(c => c.userId === userId && c.webinarId === webinarId)
}

export function issueCertificate(data) {
    const all = get(KEY) || []
    // Check if already issued
    if (all.some(c => c.userId === data.userId && c.webinarId === data.webinarId)) {
        return all.find(c => c.userId === data.userId && c.webinarId === data.webinarId)
    }
    const cert = {
        id: 'CERT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        userId: data.userId,
        userName: data.userName,
        webinarId: data.webinarId,
        webinarTitle: data.webinarTitle,
        speaker: data.speaker,
        date: data.date,
        duration: data.duration,
        issuedAt: new Date().toISOString()
    }
    all.push(cert)
    set(KEY, all)
    return cert
}

export function downloadCertificateAsText(cert) {
    const text = `
══════════════════════════════════════════════════
              CERTIFICATE OF COMPLETION
══════════════════════════════════════════════════

  This is to certify that

        ${cert.userName}

  has successfully completed the webinar/workshop

        "${cert.webinarTitle}"

  conducted by ${cert.speaker}
  on ${cert.date} (Duration: ${cert.duration})

  Certificate ID: ${cert.id}
  Issued on: ${new Date(cert.issuedAt).toLocaleDateString()}

══════════════════════════════════════════════════
            EduWebinar Platform
══════════════════════════════════════════════════
`
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `Certificate-${cert.id}.txt`
    a.click()
}
