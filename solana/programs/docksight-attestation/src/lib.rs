use anchor_lang::prelude::*;

declare_id!("2oiFFybUqLb2KhUwXNVJgZF242oE8nmrtwYeCixackN3");

#[program]
pub mod docksight_attestation {
    use super::*;

    /// Attest to a docking analysis by storing cryptographic hashes
    pub fn attest_analysis(
        ctx: Context<AttestAnalysis>,
        analysis_id: String,
        analysis_hash: String,
        report_hash: String,
    ) -> Result<()> {
        require!(analysis_id.len() <= 64, ErrorCode::AnalysisIdTooLong);
        require!(analysis_hash.len() == 64, ErrorCode::InvalidHashLength);
        require!(report_hash.len() == 64, ErrorCode::InvalidHashLength);
        
        let attestation = &mut ctx.accounts.attestation;
        let clock = Clock::get()?;
        
        attestation.authority = ctx.accounts.authority.key();
        attestation.analysis_id = analysis_id.clone();
        attestation.analysis_hash = analysis_hash.clone();
        attestation.report_hash = report_hash.clone();
        attestation.timestamp = clock.unix_timestamp;
        attestation.bump = *ctx.bumps.get("attestation").unwrap();
        
        emit!(AttestationCreated {
            authority: ctx.accounts.authority.key(),
            analysis_id,
            analysis_hash,
            report_hash,
            timestamp: clock.unix_timestamp,
        });
        
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
    
    /// SHA-256 hash of docking input files (hex string)
    pub analysis_hash: String,
    
    /// SHA-256 hash of generated report (hex string)
    pub report_hash: String,
    
    /// Unix timestamp of attestation
    pub timestamp: i64,
    
    /// PDA bump seed
    pub bump: u8,
}

impl Attestation {
    pub const SPACE: usize = 32 + // authority
                             (4 + 64) + // analysis_id (max 64 chars)
                             (4 + 64) + // analysis_hash (64 hex chars)
                             (4 + 64) + // report_hash (64 hex chars)
                             8 + // timestamp
                             1; // bump
}

#[event]
pub struct AttestationCreated {
    pub authority: Pubkey,
    pub analysis_id: String,
    pub analysis_hash: String,
    pub report_hash: String,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Analysis ID must be 64 characters or less")]
    AnalysisIdTooLong,
    #[msg("Hash must be exactly 64 characters (SHA-256 hex)")]
    InvalidHashLength,
}
