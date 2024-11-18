import {Card, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import { StarIcon} from "lucide-react";

export function FavoriteCourses(){
    return(
            <Card className="w-full mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                            <StarIcon className="mr-2 h-5 w-5 opacity-70"/>
                            Favorites
                        </div>
                    </CardTitle>
                </CardHeader>
            </Card>
    )
}