export const merge = (...classNames: (string | undefined | false)[]) => classNames.filter(Boolean).join(' ');
export function attempt<T>(executor: () => Promise<T>): Promise<[false, T] | [unknown, null]>
export function attempt<T>(executor: () => T): [false, T] | [unknown, null];
export function attempt<T>(executor: any) {
    try {
        const r = executor();
        if(r instanceof Promise) {
            return new Promise(resolve => {
                r
                    .then(r => resolve([false, r]))
                    .catch(e => [e, null]);
            });
        } else {
            return [false, r];
        }
    } catch(e) {
        return [e, null];
    }
}
export const parse = {
    number(string: string | undefined | null): number | null {
        if(string == null || string === '') return null;
        const parsed = Number(string);
        if(Number.isNaN(parsed)) return null;
        if(!Number.isFinite(parsed)) return null;
        return parsed;
    }
}