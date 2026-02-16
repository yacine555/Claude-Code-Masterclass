import styles from "./GameISI.module.css";

export default function GameISI() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <span className={styles.brand}>AUCATZYL</span>
        <span className={styles.brandSub}>obecabtagene autoleucel</span>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h3 className={styles.sectionHeading}>Indication</h3>
          <p>
            AUCATZYL® is a CD19-directed genetically modified autologous T cell
            immunotherapy indicated for the treatment of adult patients with
            relapsed or refractory B-cell precursor acute lymphoblastic leukemia
            (ALL).
          </p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionHeading}>
            Important Safety Information
          </h3>
          <div className={styles.blackBox}>
            <p className={styles.blackBoxTitle}>
              WARNING: CYTOKINE RELEASE SYNDROME, NEUROLOGIC TOXICITIES, and
              SECONDARY HEMATOLOGICAL MALIGNANCIES
            </p>
            <ul>
              <li>
                Cytokine Release Syndrome (CRS) occurred in patients receiving
                AUCATZYL. Do not administer AUCATZYL to patients with active
                infection or inflammatory disorders. Prior to administering
                AUCATZYL, ensure that healthcare providers have immediate access
                to medications and resuscitative equipment to manage CRS.
              </li>
              <li>
                Immune Effector Cell-Associated Neurotoxicity Syndrome (ICANS),
                including fatal and lifethreatening reactions, occurred in
                patients receiving AUCATZYL, including concurrently with CRS or
                after CRS resolution. Monitor for neurologic signs and symptoms
                after treatment with AUCATZYL. Prior to administering AUCATZYL,
                ensure that healthcare providers have immediate access to
                medications and resuscitative equipment to manage neurologic
                toxicities. Provide supportive care and/or corticosteroids, as
                needed.
              </li>
              <li>
                T cell malignancies have occurred following treatment of
                hematologic malignancies with BCMA- and CD19-directed
                genetically modified autologous T cell immunotherapies.
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionHeadingAlt}>Warnings and Precautions</h3>
          <p>
            Cytokine Release Syndrome (CRS) occurred following treatment with
            AUCATZYL. CRS was reported in 75% (75/100) of patients including
            Grade 3 CRS in 3% of patients. The median time to onset of CRS was 8
            days following the first infusion (range: 1 to 23 days) with a
            median duration of 5 days (range: 1 to 21 days). The most common
            manifestations of CRS included fever (100%), hypotension (35%), and
            hypoxia (19%). Prior to administering AUCATZYL, ensure that
            healthcare providers have immediate access to medications and
            resuscitative equipment to manage CRS. During and following
            treatment with AUCATZYL, closely monitor patients for signs and
            symptoms of CRS daily for at least 7 days following each infusion.
            Continue to monitor patients for CRS for at least 2 weeks following
            each infusion with AUCATZYL. Counsel patients to seek immediate
            medical attention should signs or symptoms of CRS occur at any time.
            At the first sign of CRS, immediately evaluate the patient for
            hospitalization and institute treatment with supportive care based
            on severity and consider further management per current practice
            guidelines.
          </p>
        </section>
      </div>
    </div>
  );
}
