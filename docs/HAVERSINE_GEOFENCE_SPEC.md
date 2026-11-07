# Geospatial Haversine Great-Circle Geofencing Specification

**Specification Version:** 1.0.0  
**Target Platform:** ProblemChain Civic Issue Verification Node (RUSH_HOUR_2026)  
**Standard:** WGS 84 Ellipsoid Spherical Approximation

---

## 1. Haversine Great-Circle Distance Metric

To verify that a citizen issue submission originates within an authenticated geographic boundary (e.g. municipal road hazard radius $r \le 50\,\text{m}$), ProblemChain evaluates the spherical law of haversines between GPS device coordinates $(\phi_1, \lambda_1)$ and the reported issue location $(\phi_2, \lambda_2)$:

$$\Delta\phi = \phi_2 - \phi_1, \quad \Delta\lambda = \lambda_2 - \lambda_1$$

$$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1) \cdot \cos(\phi_2) \cdot \sin^2\left(\frac{\Delta\lambda}{2}\right)$$

$$c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1 - a}\right)$$

$$d = R \cdot c$$

Where:
- Earth mean volumetric radius: $R = 6371.0088\,\text{km} = 6\,371\,008.8\,\text{m}$
- Angles $\phi_1, \phi_2, \lambda_1, \lambda_2$ are converted from decimal degrees to radians: $\text{rad} = \text{deg} \times \frac{\pi}{180}$.

---

## 2. Cryptographic Geofence Proof Validation

A submission is stamped as **Geographically Verified** when:

$$\text{Valid}(\text{Proof}) \iff d \le R_{\text{threshold}} \quad (R_{\text{threshold}} = 50.0\,\text{m})$$

If $d > R_{\text{threshold}}$, the validator node rejects the civic claim with error `E_GEOFENCE_OUT_OF_BOUNDS`, preventing synthetic remote issue inflation.
