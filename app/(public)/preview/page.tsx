// preview page for newly created UI components
import Skeleton from "@/components/Skeleton";
import Avatar from "@/components/Avatar";

export default function PreviewPage() {
  return (
    <div className="page-content">
      <h2>Preview</h2>

      <section style={{ marginTop: '32px' }}>
        <h3>Avatar</h3>
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          marginTop: '16px',
          flexWrap: 'wrap'
        }}>
          <div>
            <p style={{ fontSize: '14px', marginBottom: '8px' }}>Simple name</p>
            <Avatar name="Alice" />
          </div>
          <div>
            <p style={{ fontSize: '14px', marginBottom: '8px' }}>Lowercase name</p>
            <Avatar name="bob" />
          </div>
          <div>
            <p style={{ fontSize: '14px', marginBottom: '8px' }}>PascalCase (2 letters)</p>
            <Avatar name="JohnDoe" />
          </div>
          <div>
            <p style={{ fontSize: '14px', marginBottom: '8px' }}>Multiple uppercase</p>
            <Avatar name="MaryCatherineSmith" />
          </div>
        </div>
      </section>

      <section style={{ marginTop: '48px' }}>
        <h3>Skeleton</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginTop: '16px'
        }}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </section>
    </div>
  )
}
