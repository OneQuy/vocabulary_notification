import { appSchema, tableSchema } from '@nozbe/watermelondb'
import { Model } from '@nozbe/watermelondb'
import { field, text } from '@nozbe/watermelondb/decorators'


class SavedWordModel extends Model {
    static table = 'SavedWords'
    
    @text('word') word
    @text('body') body
    @field('is_pinned') isPinned
}

// change your tableSchema here:

const tables = [
    tableSchema({
        name: 'SavedWords',

        columns: [
            { name: 'word', type: 'string' },
            { name: 'notiTick', type: 'number' },
            { name: 'value', type: 'string' },

            // { name: 'subtitle', type: 'string', isOptional: true },
            // { name: 'is_pinned', type: 'boolean' },
        ]
    }),

    // tableSchema({
    //     name: 'comments',
    //     columns: [
    //         { name: 'body', type: 'string' },
    //         { name: 'post_id', type: 'string', isIndexed: true },
    //     ]
    // })
]

// change your ModelArr here:

export const ModelArr = [SavedWordModel]

// keep this

export default appSchema({
    version: 1,
    tables,
})