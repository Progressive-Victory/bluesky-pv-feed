import {
	OutputSchema as RepoEvent,
	isCommit
} from './lexicon/types/com/atproto/sync/subscribeRepos';
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription';

export class FirehoseSubscription extends FirehoseSubscriptionBase {
	async handleEvent(evt: RepoEvent) {
		if (!isCommit(evt)) return;
		const ops = await getOpsByType(evt);

		const postsToDelete = ops.posts.deletes.map((del) => del.uri);
		const postsToCreate = ops.posts.creates
			.filter((create) => {
				// create.record.author should be @progressiveictory.win https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=progressivevictory.win
				return (
					create.record.author ===
                        'did:plc:4ndyufcdqvuihxwsicuaboru' ||
                    // OR create.record.text should contain a hashtag such as #pv
                    create.record.text.toLowerCase().includes('#pv')
				);
				// TODO: Or anybody this account follows
			})
			.map((create) => {
				// map alf-related posts to a db row
				return {
					uri: create.uri,
					cid: create.cid,
					replyParent: create.record?.reply?.parent.uri ?? null,
					replyRoot: create.record?.reply?.root.uri ?? null,
					indexedAt: new Date().toISOString()
				};
			});

		if (postsToDelete.length > 0) {
			await this.db
				.deleteFrom('post')
				.where('uri', 'in', postsToDelete)
				.execute();
		}
		if (postsToCreate.length > 0) {
			await this.db
				.insertInto('post')
				.values(postsToCreate)
				.onConflict((oc) => oc.doNothing())
				.execute();
		}
	}
}
