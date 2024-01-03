import {
  CommitmentRating,
  InstructorRating,
  OverallRating,
  RatingCalculations,
} from '../types/RatingTypes';

export function ratingAverage(
  scores?: OverallRating | CommitmentRating | InstructorRating
): RatingCalculations {
  if (!scores) {
    return [0, 0];
  }
  let avg = 0;
  let total = 0;
  for (const key in scores) {
    const k = parseInt(key);
    avg += k * scores[k as keyof typeof scores];
    total += scores[k as keyof typeof scores];
  }
  return [avg / (total || 1), total];
}

export function chooseOverallRatingSummary(scores?: OverallRating) {
  if (!scores) {
    return 'There are no ratings yet.';
  }
  const [avg, total] = ratingAverage(scores);
  if (!total) {
    return 'There are no ratings yet.';
  }

  if (avg < 4) {
    if (avg < 3) {
      if (avg < 2) {
        return 'Students thought this course was trash.';
      }
      return "Students thought this course wasn't that great.";
    }
    return 'Students thought this course was not bad.';
  }
  return 'Students really liked this course!';
}

export function chooseCommitmentRatingSummary(scores?: CommitmentRating) {
  if (!scores) {
    return 'There are no ratings yet.';
  }
  const [avg, total] = ratingAverage(scores);
  if (!total) {
    return 'There are no ratings yet.';
  }

  if (avg < 4) {
    if (avg < 3) {
      if (avg < 2) {
        return 'Seems like this course is pretty chill.';
      }
      return 'Seems like students were a little busy in this course.';
    }
    return 'Seems like students were busy in this course.';
  }
  return 'The time commitment on this course is wild.';
}

export function chooseInstructorRatingSummary(scores?: InstructorRating) {
  if (!scores) {
    return 'There are no ratings yet.';
  }
  const [avg, total] = ratingAverage(scores);
  if (!total) {
    return 'There are no ratings yet.';
  }

  if (avg < 4) {
    if (avg < 3) {
      if (avg < 2) {
        return "Looks like students didn't really like this instructor.";
      }
      return 'Looks like students thought the instructor was fine.';
    }
    return 'Looks like students thought the instructor was pretty good.';
  }
  return 'Looks like students really liked this instructor!';
}
