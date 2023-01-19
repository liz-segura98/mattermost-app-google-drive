import { ExceptionType } from 'src/constant';
import { MattermostClient } from '../clients';
import { Channel, ExtendedAppCallRequest, MattermostOptions, PostCreate, PostResponse } from '../types';
import { tryPromise } from './utils';
import { configureI18n } from '../utils/translations';

export const postBotChannel = async (call: ExtendedAppCallRequest, message: string, props: any = {}) => {
    const mattermostUrl: string = call.context.mattermost_site_url!;
    const botAccessToken: string = call.context.bot_access_token!;
    const botUserId: string = call.context.bot_user_id!;
    const actingUserId: string = call.context.acting_user.id!;
    const i18nObj = configureI18n(call.context);

    const mattermostOption: MattermostOptions = {
        mattermostUrl,
        accessToken: botAccessToken,
    };

    const mmClient: MattermostClient = new MattermostClient(mattermostOption);
    const channel: Channel = await tryPromise<Channel>(mmClient.createDirectChannel([<string>botUserId, <string>actingUserId]), ExceptionType.TEXT_ERROR, i18nObj.__('general.mattermost-errors.create-channel'), call);

    const post: PostCreate = {
        message,
        channel_id: channel.id,
        props,
    };
    await tryPromise<PostResponse>(mmClient.createPost(post), ExceptionType.TEXT_ERROR, i18nObj.__('general.mattermost-errors.post-create'), call);
};
