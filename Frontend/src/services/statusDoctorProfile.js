import { toast } from 'react-toastify'

const handleUpload = (e, type) => {
  const file = e.target.files[0]
  if (!file) return
 
  // Validate size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.warning("File quá lớn! Tối đa 5MB.")
    return
  }
 
  // Tạo URL preview local — không cần gọi API
  const localUrl = URL.createObjectURL(file)
 
  if (type === "idCard") {
    setFiles(prev => ({ ...prev, idCard: file }))
    setForm(prev => ({ ...prev, idCardUrl: localUrl }))
  } else {
    setFiles(prev => ({ ...prev, certificate: file }))
    setForm(prev => ({ ...prev, certificateUrl: localUrl }))
  }
}
 
// Khi submit, gửi file thật qua FormData:
const handleSubmit = async () => {
  setLoading(true)
  try {
    const formData = new FormData()
    formData.append("bio", form.bio)
    formData.append("degree", form.degree)
    formData.append("experienceYears", form.experienceYears)
    formData.append("price", form.price)
    formData.append("specialtyId", form.specialtyId)
    formData.append("facilityId", form.facilityId)
    if (files.idCard) formData.append("idCard", files.idCard)
    if (files.certificate) formData.append("certificate", files.certificate)
 
    await api.post("/doctors/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
 
    const user = JSON.parse(localStorage.getItem("user"))
    user.verificationStatus = "PENDING"
    localStorage.setItem("user", JSON.stringify(user))
    navigate("/")
  } catch (err) {
    toast.error("Gửi hồ sơ thất bại!")
  }
  setLoading(false)
}