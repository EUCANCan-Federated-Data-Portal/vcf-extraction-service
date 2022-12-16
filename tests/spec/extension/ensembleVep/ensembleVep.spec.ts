import VCF from '@gmod/vcf';
import { expect } from 'chai';
import { describe } from 'mocha';

import { parsers } from '../../../setup/parser';
import { variants } from '../../../setup/variants';

import ensembleVepParser from '../../../../src/extensions/ensembleVep';
import { Annotation, Frequency } from '../../../../src';

let parser: VCF;
let annotatedVariant = variants.annotated.ensembleVep;

describe('Extension - EnsembleVEP', () => {
	before(async () => {
		/* Build a parser, same mechanism as in extractor */
		parser = await parsers.annotated.ensembleVep;
	});
	it('annotated variants are parsed successfully', () => {
		const extendedVariant = ensembleVepParser({ variant: annotatedVariant, parser });
		expect(extendedVariant.success).to.be.true;
	});
	it('annotated variants have added properties', () => {
		const extendedVariant = ensembleVepParser({ variant: annotatedVariant, parser });

		expect(extendedVariant.success && Array.isArray(extendedVariant.data.annotations)).to.be.true;
		expect(extendedVariant.success && extendedVariant.data.annotations.length).to.equal(2);
		expect(extendedVariant.success && Array.isArray(extendedVariant.data.frequencies)).to.be.true;
		expect(extendedVariant.success && extendedVariant.data.frequencies.length).to.equal(2);
	});
	it('annotated variants must have correct annotation values', () => {
		const extendedVariant = ensembleVepParser({ variant: annotatedVariant, parser });

		expect(extendedVariant.success).to.be.true;

		const expected = {
			amino_acids_reference: '12',
			amino_acids_variant: '34',
			biotype: 'miRNA,protein_coding,antisense',
			canonical: true,
			ccds: 'CCDS45064.1',
			cdna_position: 361,
			cdna_length: 1696,
			cds_position: 1426,
			cds_length: 3876,
			clin_sig: 'clin-sig',
			codons_reference: 'aAa',
			codons_variant: 'aCa',
			consequence: ['splice_region_variant', 'synonymous_variant', 'NMD_transcript_variant,upstream_gene_variant'],
			cosmic: ['COSV57135585', 'COSVtest'],
			dbsnp: ['rs1000151449', 'rs1000test'],
			exon_rank: 53,
			exon_total: 93,
			feature_type: 'Transcript',
			feature_strand: '1',
			gene_pheno: 4,
			gene_symbol: 'gene_symbol',
			hgvsc: 'hgvsc',
			hgvsp: 'hgvsp',
			high_inf_pos: 'Y',
			intron_rank: 2,
			intron_total: 14,
			mane_plus_clinical: 'plus_clinical',
			mane_select: 'mane_select',
			motif_name: 'ENSPFM0017',
			motif_pos: 21,
			motif_score_change: -0.037,
			polyphen_impact: 'benign',
			polyphen_score: 0.014,
			protein_position: 37,
			protein_length: 323,
			pubmed: [
				'24033266',
				'23757202',
				'25157968',
				'26619011',
				'12068308',
				'12960123',
				'14679157',
				'15035987',
				'21639808',
				'22048237',
				'22663011',
				'22972589',
				'19206169',
				'12198537',
				'16953233',
				'16187918',
			],
			sift_impact: 'tolerated',
			sift_score: 1.2,
			uniparc: 'UPI000002A538',
			uniprotkb_swissprot: 'BLMH_HUMAN',
			uniprotkb_trembl: 'D6RGY0_HUMAN',
			vep_impact: 'MODIFIER,LOW,MODERATE',
			transcription_factors: [
				'ELK1::HOXB13',
				'HOXB13::ETV1',
				'FLI1::HOXB13',
				'HOXB13::ELK1',
				'HOXD12::ELK3',
				'HOXD12::ETV1',
				'HOXD12::ETV4',
				'ETV2::HOXB13',
				'ETV5::HOXB13',
			],
		} satisfies Annotation;

		expect(extendedVariant.success && extendedVariant.data.annotations[0]).to.deep.equal(expected);
	});

	it('annotated variants must have correct frequency values', () => {
		const extendedVariant = ensembleVepParser({ variant: annotatedVariant, parser });

		expect(extendedVariant.success).to.be.true;

		const expected = {
			'1000_genomes': {
				af: '4.78E-05',
				afr_af: 'afr-af',
				amr_af: 'amr-af',
				eas_af: 'eas-af',
				eur_af: 'eur-af',
				sas_af: 'sas-af',
			},
			esp: { aa_af: 'aa-af', ea_af: 'ea-af' },
			gnomad_exomes: {
				af: 'gnom-ad-af',
				afr_af: 'gnom-ad-afr-af',
				amr_af: 'gnom-ad-amr-af',
				asj_af: 'gnom-ad-asj-af',
				eas_af: 'gnom-ad-eas-af',
				fin_af: 'gnom-ad-fin-af',
				nfe_af: 'gnom-ad-nfe-af',
				oth_af: 'gnom-ad-oth-af',
				sas_af: 'gnom-ad-sas-af',
			},
		} satisfies Frequency;

		expect(extendedVariant.success && extendedVariant.data.frequencies[0]).to.deep.equal(expected);
	});
	it('annotated variants must parse empty values correctly', () => {
		// Second CSQ value in the provided example has many empty fields
		const extendedVariant = ensembleVepParser({ variant: annotatedVariant, parser });

		expect(extendedVariant.success).to.be.true;

		const expected = {
			biotype: 'protein_coding',
			canonical: true,
			ccds: 'CCDS53257.1',
			consequence: ['downstream_gene_variant'],
			cosmic: [],
			dbsnp: [],
			feature_type: 'Transcript',
			feature_strand: '-1',
			gene_symbol: 'RNF223',
			mane_select: 'NM_001205252.2',
			pubmed: [],
			uniparc: 'UPI0001A5E6EF',
			uniprotkb_swissprot: 'E7ERA6.73',
			vep_impact: 'MODIFIER',
			transcription_factors: [],
		} satisfies Annotation;

		// test expected with `include` to ignore the many undefined properties
		expect(extendedVariant.success && extendedVariant.data.annotations[1]).to.deep.include(expected);
	});
});
