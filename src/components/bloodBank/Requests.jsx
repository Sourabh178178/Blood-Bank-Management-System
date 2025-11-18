import React, { useState, useEffect } from "react";
import axios from "axios";


const BloodBankRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch requests with date range filtering
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const params = {};
        if (startDate) params.start = startDate;
        if (endDate) params.end = endDate;

        const res = await axios.get("/bloodbank/requests", {
          params,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRequests(res.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load requests.");
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [startDate, endDate]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(
        `/bloodbank/requests/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRequests((prev) =>
        prev.map((request) =>
          request._id === id ? { ...request, status } : request
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update request status."
      );
    }
  };

  const filteredRequests = requests
    .filter((request) => {
      if (filter === "all") return true;
      return request.status === filter;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort newest first

  // Utility for badge colors
  const getUrgencyBadgeColor = (urgency) => {
    switch (urgency) {
      case "high":
        return { background: "#fee2e2", color: "#b91c1c" };
      case "medium":
        return { background: "#fef9c3", color: "#b45309" };
      case "low":
        return { background: "#dbeafe", color: "#1e40af" };
      default:
        return { background: "#f3f4f6", color: "#374151" };
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "approved":
        return { background: "#bbf7d0", color: "#166534" };
      case "pending":
        return { background: "#fef9c3", color: "#b45309" };
      case "rejected":
        return { background: "#fee2e2", color: "#b91c1c" };
      case "fulfilled":
        return { background: "#dbeafe", color: "#1e40af" };
      default:
        return { background: "#f3f4f6", color: "#374151" };
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: 24,
        }}
      >
        Blood Requests
      </h1>
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          {error}
        </div>
      )}

      {/* Date Filter Controls */}
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
          padding: 16,
          marginBottom: 16,
          display: "flex",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label style={{ fontWeight: 500, marginRight: 8 }}>From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate || undefined}
          />
        </div>
        <div>
          <label style={{ fontWeight: 500, marginRight: 8 }}>To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || undefined}
          />
        </div>
        {(startDate || endDate) && (
          <button
            style={{
              marginLeft: 12,
              padding: "6px 16px",
              borderRadius: 6,
              background: "#f3f4f6",
              color: "#374151",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
          >
            Clear Dates
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
          padding: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: "8px 20px",
                borderRadius: 6,
                background: filter === status ? "#dc2626" : "#f3f4f6",
                color: filter === status ? "#fff" : "#374151",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Request Cards */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <div
            style={{
              border: "4px solid #dc2626",
              borderTop: "4px solid #fff",
              borderRadius: "50%",
              width: 48,
              height: 48,
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      ) : (
        <div>
          {filteredRequests.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                padding: 24,
                textAlign: "center",
              }}
            >
              <p style={{ color: "#6b7280" }}>
                No requests found matching the selected filter.
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request._id}
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                  padding: 24,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 600 }}>
                      {request.hospital?.name ||
                        request.hospital?.hospitalId ||
                        "Unknown Hospital"}
                    </h2>
                    <p style={{ color: "#6b7280" }}>
                      {request.hospital?.address || ""}
                    </p>
                    <p style={{ color: "#6b7280" }}>
                      Contact: {request.hospital?.contact || "N/A"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", marginTop: 8 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "flex-end",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          ...getUrgencyBadgeColor(request.urgency),
                          padding: "4px 10px",
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {request.urgency?.toUpperCase()} Urgency
                      </span>
                      <span
                        style={{
                          ...getStatusBadgeColor(request.status),
                          padding: "4px 10px",
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {request.status?.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>
                      Requested on{" "}
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    borderTop: "1px solid #eee",
                    borderBottom: "1px solid #eee",
                    padding: "12px 0",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ marginBottom: 8 }}>
                      <p style={{ color: "#374151" }}>
                        <strong>Blood Type:</strong> {request.bloodType}
                      </p>
                      <p style={{ color: "#374151" }}>
                        <strong>Quantity:</strong> {request.quantity} units
                      </p>
                    </div>
                    <div>
                      <p style={{ color: "#374151" }}>
                        <strong>Notes:</strong>
                      </p>
                      <p style={{ color: "#6b7280" }}>
                        {request.notes || "No additional notes"}
                      </p>
                    </div>
                  </div>
                </div>
                {request.status === "pending" && (
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={() =>
                        handleUpdateStatus(request._id, "fulfilled")
                      }
                      style={{
                        background: "#16a34a",
                        color: "#fff",
                        fontWeight: 600,
                        padding: "8px 18px",
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Approve & Fulfill
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(request._id, "rejected")
                      }
                      style={{
                        background: "#dc2626",
                        color: "#fff",
                        fontWeight: 600,
                        padding: "8px 18px",
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
      {/* Spinner keyframes (for inline style) */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
};

export default BloodBankRequests;
