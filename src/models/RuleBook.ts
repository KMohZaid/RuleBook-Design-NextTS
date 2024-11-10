import { Schema, Document, model, models } from 'mongoose';

export interface Section {
	_id: string;
	section: string;
	title: string;
	description: string;
	content: string;
}
interface IRuleBook extends Document {
	section: string; // "Rules", "FAQ", "Wiki"
	title: string;
	description: string;
	content: string;
}

const RuleBookSchema: Schema = new Schema({
	section: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
});

export default models.RuleBook || model<IRuleBook>('RuleBook', RuleBookSchema);

