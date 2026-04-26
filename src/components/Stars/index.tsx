import { FaStar, FaRegStar } from "react-icons/fa";
import './index.scss'

export interface Props {
    rating: number;
}

export default function Stars(props: Props) {
    const hasRating = props.rating > 0;

    return (
        <div className="movie-rate">
            {hasRating ? <FaStar className="star-icon" /> : <FaRegStar className="star-icon" />}
            
            <span className="rate-number">
                {hasRating ? props.rating.toFixed(1) : 'Sem nota'}
            </span>
        </div>
    );
}