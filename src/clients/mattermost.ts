import axios, { AxiosResponse } from 'axios';

import {
    ClientConfig,
} from '@mattermost/types/lib/config';

import {
    Channel,
    ChannelMember,
    MattermostOptions,
    PostCreate,
    PostEphemeralCreate,
    PostResponse,
    PostUpdate,
    User,
} from '../types';
import { AppsPluginName, Routes } from '../constant';
import { replace } from '../utils/utils';
import stream from 'stream';

export class MattermostClient {
    private readonly config: MattermostOptions;

    constructor(
        config: MattermostOptions
    ) {
        this.config = config;
    }

    public createPost(post: PostCreate): Promise<PostResponse> {
        const url = `${this.config.mattermostUrl}${Routes.MM.ApiVersionV4}${Routes.MM.PostsPath}`;
        return axios.post(url, post, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
            },
        });
    }

    public getPost(postId: string): Promise<PostResponse> {
        const url = `${this.config.mattermostUrl}${Routes.MM.ApiVersionV4}${Routes.MM.PostPath}`;
        return axios.get(replace(url, Routes.PV.Identifier, postId), {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
            },
        });
    }

    public getUser(userId: string): Promise<User> {
        const url = `${this.config.mattermostUrl}${Routes.MM.ApiVersionV4}${Routes.MM.UserPath}`;
        return axios.get(replace(url, Routes.PV.Identifier, userId), {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
            },
        });
    }

    public createDirectChannel(ids: string[]): Promise<any> {
        const url = `${this.config.mattermostUrl}${Routes.MM.ApiVersionV4}${Routes.MM.ChannelDirectPath}`;
        return axios.post(url, ids, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
            },
        });
    }

    public getChannelMembers(channelId: string): Promise<ChannelMember[]> {
        const url = `${this.config.mattermostUrl}${Routes.MM.ApiVersionV4}${Routes.MM.ChannelPath}${Routes.MM.MembersPath}`;
        return axios.get(replace(url, Routes.PV.Identifier, channelId), {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
            },
        });
    }

    public getUsersById(usersIDs: string[]): Promise<User[]> {
        const url = `${this.config.mattermostUrl}${Routes.MM.ApiVersionV4}${Routes.MM.UsersIdPath}`;
        return axios.post(url, usersIDs, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
            },
        });
    }

    public getFileUploaded(fileID: string): Promise<stream> {
        const url = `${this.config.mattermostUrl}${Routes.MM.ApiVersionV4}${Routes.MM.FilePath}`;
        return axios.get(replace(url, Routes.PV.Identifier, fileID), {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
            },
            responseType: 'stream',
        });
    }

    public getConfigClient(): Promise<ClientConfig> {
        const url = new URL(`${this.config.mattermostUrl}${Routes.MM.ApiVersionV4}${Routes.MM.ConfigClientPath}`);
        url.searchParams.append('format', 'old');

        return axios.get(url.href);
    }
}
