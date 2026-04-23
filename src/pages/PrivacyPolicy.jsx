export default function PrivacyPolicy() {
  return (
    <div className="page-content">
      <h1>Data Privacy Notice</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2>Information We Collect</h2>
      <p>
        Calicu World is a calculator application that runs entirely in your browser.
        We do not collect, store, or transmit any personal information or calculation data.
        All computations are performed locally on your device.
      </p>
      <h2>Data Usage</h2>
      <p>
        Since no data is collected, there is no usage of personal data.
        Your calculations remain private and are not shared with anyone.
      </p>
      <h2>Third-Party Services</h2>
      <p>
        This application does not integrate with any third-party services that collect data.
        Any advertisements displayed are placeholders and do not track user behavior.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Notice, please contact us through the Contact page.
      </p>
    </div>
  )
}