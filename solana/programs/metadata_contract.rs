use anchor_lang::prelude::*;

declare_id!("DockSightAttestation11111111111111111111111");

#[program]
pub mod docksight_attestation {
    use super::*;

    /// Attest to a docking analysis by storing cryptographic hashes
    pub fn attest_analysis(
        ctx: Context<AttestAnalysis>,
        analysis_id: String,
        input_hash: [u8; 32],
        report_hash: [u8; 32],
    ) -> Result<()> {
        let attestation = &mut ctx.accounts.attestation;
        
        attestation.authority = ctx.accounts.authority.key();
        attestation.analysis_id = analysis_id;
        attestation.input_hash = input_hash;
        attestation.report_hash = report_hash;
        attestation.timestamp = Clock::get()?.unix_timestamp;
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(analysis_id: String)]
pub struct AttestAnalysis<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Attestation::SPACE,
        seeds = [b"attestation", analysis_id.as_bytes()],
        bump
    )]
    pub attestation: Account<'info, Attestation>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Attestation {
    /// Authority that created the attestation
    pub authority: Pubkey,
    
    /// Unique identifier for this analysis
    pub analysis_id: String,
    
    /// SHA-256 hash of docking input files
    pub input_hash: [u8; 32],
    
    /// SHA-256 hash of generated report
    pub report_hash: [u8; 32],
    
    /// Unix timestamp of attestation
    pub timestamp: i64,
}

impl Attestation {
    pub const SPACE: usize = 32 + // authority
                             (4 + 64) + // analysis_id (max 64 chars)
                             32 + // input_hash
                             32 + // report_hash
                             8; // timestamp
}
