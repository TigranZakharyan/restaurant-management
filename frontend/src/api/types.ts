export type TUser = {
    fullName: string;
    _id: string;
}

export type TUserLoginRequest = {
    fullName: string;
    password: string;
}

export type TOrder = {
    _id: string | undefined;
    items: Array<{ productId: string; quantity: string }> | undefined;
    product: TProduct;
    quantity: number;
    checked: boolean;
};

export type TTable = {
    _id: string;
    title: string;
    orderId: {
        items: Array<{ productId: string; quantity: string }>;
        _id: string
    };
    status: 'free' | 'reserved' | 'busy';
    seats: number;
}


export type TCategory = {
    _id: string;
    title: string;
    img: string;
}

export type TProduct = {
    img: any;
    _id: string;
    title: string;
    categoryId: string;
    price: number;
    unit: string
}

export type TOrderItemRequest = {
    productId: string;
    quantity: number;
};

export type TCreateOrderRequest = {
    tableId: string;
    items: TOrderItemRequest[];
};
