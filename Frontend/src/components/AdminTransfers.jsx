import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const AdminTransfers = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [status, setStatus] = useState("PENDING");
    
    // Modal state for processing
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [adminNote, setAdminNote] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, [page, status]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/transfers?status=${status}&page=${page}&size=10`);
            setRequests(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data || "Không thể tải danh sách yêu cầu";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleProcess = async (action) => {
        if (!adminNote.trim() && action === "reject") {
            toast.error("Vui lòng nhập lý do từ chối");
            return;
        }
        setIsProcessing(true);
        try {
            await api.put(`/admin/transfers/${selectedRequest.id}/${action}`, { adminNote });
            toast.success(action === "approve" ? "Đã duyệt yêu cầu chuyển công tác" : "Đã từ chối yêu cầu");
            setSelectedRequest(null);
            setAdminNote("");
            fetchRequests();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi xử lý yêu cầu");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Duyệt chuyển công tác</h2>
                <div style={{ display: "flex", background: "#f1f5f9", padding: "4px", borderRadius: "8px" }}>
                    {["PENDING", "APPROVED", "REJECTED"].map((s) => (
                        <button
                            key={s}
                            onClick={() => { setStatus(s); setPage(0); }}
                            style={{
                                padding: "8px 16px", borderRadius: "6px", border: "none", fontSize: "13px", fontWeight: 600,
                                cursor: "pointer", transition: "all 0.2s",
                                background: status === s ? "#fff" : "transparent",
                                color: status === s ? "#0ea47a" : "#64748b",
                                boxShadow: status === s ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                            }}
                        >
                            {s === "PENDING" ? "Chờ duyệt" : s === "APPROVED" ? "Đã duyệt" : "Từ chối"}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>Đang tải...</div>
            ) : requests.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Không có yêu cầu nào.</div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                        <thead>
                            <tr style={{ textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                                <th style={{ padding: "12px", color: "#64748b", fontWeight: 600 }}>Bác sĩ</th>
                                <th style={{ padding: "12px", color: "#64748b", fontWeight: 600 }}>Cơ sở cũ</th>
                                <th style={{ padding: "12px", color: "#64748b", fontWeight: 600 }}>Cơ sở mới</th>
                                <th style={{ padding: "12px", color: "#64748b", fontWeight: 600 }}>Lý do</th>
                                <th style={{ padding: "12px", color: "#64748b", fontWeight: 600 }}>Ngày gửi</th>
                                {status === "PENDING" && <th style={{ padding: "12px", color: "#64748b", fontWeight: 600 }}>Hành động</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "12px", fontWeight: 600 }}>{req.doctor?.user?.fullName}</td>
                                    <td style={{ padding: "12px" }}>{req.doctor?.facility?.facilityName}</td>
                                    <td style={{ padding: "12px", color: "#0ea47a", fontWeight: 600 }}>{req.targetFacility?.facilityName}</td>
                                    <td style={{ padding: "12px", maxWidth: "200px" }}>{req.reason}</td>
                                    <td style={{ padding: "12px" }}>{new Date(req.createdAt).toLocaleDateString("vi-VN")}</td>
                                    {status === "PENDING" && (
                                        <td style={{ padding: "12px" }}>
                                            <button 
                                                onClick={() => setSelectedRequest(req)}
                                                style={{ border: "none", background: "#e8faf3", color: "#0ea47a", padding: "6px 12px", borderRadius: "6px", fontWeight: 600, cursor: "pointer" }}
                                            >
                                                Xử lý
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination placeholder */}
            {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
                    {[...Array(totalPages)].map((_, i) => (
                        <button key={i} onClick={() => setPage(i)} style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid #e2e8f0", background: page === i ? "#0ea47a" : "#fff", color: page === i ? "#fff" : "#1e293b", cursor: "pointer" }}>{i + 1}</button>
                    ))}
                </div>
            )}

            {/* Process Modal */}
            {selectedRequest && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
                    <div style={{ background: "#fff", padding: "32px", borderRadius: "16px", width: "100%", maxWidth: "500px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
                        <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: 800 }}>Xử lý yêu cầu chuyển công tác</h3>
                        <div style={{ marginBottom: "20px", fontSize: "14px", lineHeight: 1.6 }}>
                            <p><strong>Bác sĩ:</strong> {selectedRequest.doctor?.user?.fullName}</p>
                            <p><strong>Cơ sở mới:</strong> {selectedRequest.targetFacility?.facilityName}</p>
                            <p><strong>Địa chỉ:</strong> {selectedRequest.targetFacility?.address}, {selectedRequest.targetFacility?.province}</p>
                        </div>
                        
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "8px", textTransform: "uppercase" }}>Ghi chú / Lý do từ chối (nếu có)</label>
                        <textarea 
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1.5px solid #e2e8f0", minHeight: "100px", fontSize: "14px", outline: "none", background: "#f8fafc", marginBottom: "24px" }}
                            placeholder="..."
                        />

                        <div style={{ display: "flex", gap: "12px" }}>
                            <button onClick={() => setSelectedRequest(null)} style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "#f1f5f9", border: "none", fontWeight: 700, cursor: "pointer" }}>Đóng</button>
                            <button onClick={() => handleProcess("reject")} disabled={isProcessing} style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "#fef2f2", color: "#dc2626", border: "none", fontWeight: 700, cursor: "pointer" }}>Từ chối</button>
                            <button onClick={() => handleProcess("approve")} disabled={isProcessing} style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "#0ea47a", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}>Duyệt</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTransfers;
