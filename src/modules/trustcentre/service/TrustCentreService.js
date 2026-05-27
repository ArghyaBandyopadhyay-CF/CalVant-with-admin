//const TC_BASE = `${process.env.REACT_APP_SP}/trust-centre-service/api`;
const TC_BASE = `https://api.calvant.com/trust-service/api`;

class TrustCentreService {

  // ── Internal preview (logged-in org users) ──────────────── This Module is Developed by Arghya Bandyopadhyay , code -090
  async getInternalView(token) {
    try {
      const res = await fetch(`${TC_BASE}/preview/internal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch Trust Centre");
      return await res.json();
    } catch (err) {
      console.error("Error fetching Trust Centre:", err);
      return null;
    }
  }

  // ── Logo URL (public, no auth needed) ─────────────────────
  getLogoUrl(organization) {
    return `${TC_BASE}/preview/${organization}/logo`;
  }

  // ── Download policy (auditor / admin only) ────────────────
  async downloadPolicy(policyName, organization, token) {
    try {
      const url = `${TC_BASE}/trust-centre/policies/${encodeURIComponent(policyName)}/download?organization=${encodeURIComponent(organization)}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");
      return await res.blob();
    } catch (err) {
      console.error("Error downloading policy:", err);
      throw err;
    }
  }
}

export default new TrustCentreService();